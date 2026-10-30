import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATASETS_DIR = fs.existsSync(path.resolve(__dirname, 'datasets'))
  ? path.resolve(__dirname, 'datasets')
  : path.resolve(process.cwd(), 'server', 'data', 'datasets');

function parseCSV(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    const values = [];
    let inQuotes = false;
    let currentValue = '';

    for (let j = 0; j < currentLine.length; j++) {
      const char = currentLine[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        let val = values[index];
        if (!isNaN(val) && val !== '') {
          val = Number(val);
        }
        row[header] = val;
      });
      rows.push(row);
    }
  }

  return rows;
}

export function loadDependencyMap() {
  const file = path.join(DATASETS_DIR, 'dependency_map.json');
  if (!fs.existsSync(file)) return {};
  const raw = fs.readFileSync(file, 'utf-8');
  return JSON.parse(raw);
}

export function loadConfigChanges() {
  const file = path.join(DATASETS_DIR, 'config_changes.csv');
  let rows = parseCSV(file);

  // Automatically merge official sabotage drop file if present
  const sabotageFile = path.join(DATASETS_DIR, 'config_change_addition.csv');
  if (fs.existsSync(sabotageFile)) {
    const sabotageRows = parseCSV(sabotageFile);
    rows = [...rows, ...sabotageRows];
  }

  // Sort chronologically by timestamp_min
  rows.sort((a, b) => Number(a.timestamp_min) - Number(b.timestamp_min));

  return rows.map(r => ({
    id: r.change_id,
    minuteOffset: Number(r.timestamp_min),
    timestamp: new Date(Date.parse("2026-09-25T04:00:00.000Z") + Number(r.timestamp_min) * 60 * 1000).toISOString(),
    timeFormatted: `T+${String(Math.floor(r.timestamp_min / 60)).padStart(2, '0')}:${String(r.timestamp_min % 60).padStart(2, '0')}`,
    service: r.service,
    changeType: r.change_id === "cfg-2001" ? "Sabotage Decoy Config" : "Infrastructure Delta",
    description: r.description,
    author: r.service === "network-gateway" ? "infra-mesh-bot@cascade.ai" : "sre-ops@cascade.ai",
    environment: "production-core",
    parameters: { raw_delta: r.description }
  }));
}

export function loadMetricsStream() {
  const file = path.join(DATASETS_DIR, 'metrics_stream.csv');
  const rows = parseCSV(file);
  const dependencyMap = loadDependencyMap();

  const serviceSet = new Set(Object.keys(dependencyMap));
  rows.forEach(r => serviceSet.add(r.service));
  const serviceList = Array.from(serviceSet);

  const timeMap = new Map();

  rows.forEach(r => {
    const min = Number(r.timestamp_min);
    if (!timeMap.has(min)) {
      timeMap.set(min, {});
    }
    const snap = timeMap.get(min);
    snap[r.service] = {
      serviceId: r.service,
      latency: Number(r.latency_ms),
      requestVolume: Number(r.request_volume),
      errorRate: Number(r.error_rate_pct)
    };
  });

  const baselines = {};
  serviceList.forEach(svc => {
    const earlyLatencies = [];
    rows.forEach(r => {
      if (r.service === svc && Number(r.timestamp_min) <= 30) {
        earlyLatencies.push(Number(r.latency_ms));
      }
    });

    if (earlyLatencies.length > 0) {
      const mean = earlyLatencies.reduce((a, b) => a + b, 0) / earlyLatencies.length;
      const variance = earlyLatencies.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / earlyLatencies.length;
      const stdDev = Math.max(1.0, Math.sqrt(variance));
      baselines[svc] = {
        mean: Math.round(mean * 10) / 10,
        stdDev: Math.round(stdDev * 10) / 10
      };
    } else {
      baselines[svc] = { mean: 25.0, stdDev: 3.0 };
    }
  });

  const timestamps = Array.from(timeMap.keys()).sort((a, b) => a - b);

  const timeSeries = timestamps.map(min => {
    const rawServices = timeMap.get(min) || {};
    const formattedTime = `T+${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
    const isoTime = new Date(Date.parse("2026-09-25T04:00:00.000Z") + min * 60 * 1000).toISOString();

    const serviceMetrics = {};

    serviceList.forEach(svc => {
      const base = baselines[svc] || { mean: 25.0, stdDev: 3.0 };
      const current = rawServices[svc] || {
        serviceId: svc,
        latency: base.mean,
        requestVolume: 1000,
        errorRate: 0.1
      };

      const zScore = Math.round(((current.latency - base.mean) / base.stdDev) * 100) / 100;

      let status = "healthy";
      if (zScore > 5.0 || current.errorRate > 5.0) {
        status = "critical";
      } else if (zScore > 2.0 || current.errorRate > 0.5) {
        status = "degrading";
      }

      const upstream = Object.keys(dependencyMap).filter(k => dependencyMap[k].includes(svc));
      const downstream = dependencyMap[svc] || [];

      serviceMetrics[svc] = {
        serviceId: svc,
        name: svc.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        timestamp: isoTime,
        minuteOffset: min,
        latency: current.latency,
        baselineLatency: base.mean,
        stdDev: base.stdDev,
        zScore: zScore,
        errorRate: current.errorRate,
        baselineErrorRate: 0.1,
        requestVolume: current.requestVolume,
        queueDepth: Math.max(0, Math.floor((current.latency - base.mean) / 4)),
        status: status,
        upstream: upstream,
        downstream: downstream
      };
    });

    return {
      minuteOffset: min,
      timestamp: isoTime,
      timeFormatted: formattedTime,
      services: serviceMetrics
    };
  });

  return {
    dependencyMap,
    baselines,
    timeSeries,
    serviceList
  };
}
