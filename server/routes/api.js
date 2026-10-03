import express from 'express';
import { getRawDatasets, getConfigChanges, analyzeIncidentAtTime, getRecoveryAdvisorForService } from '../services/incidentEngine.js';

const router = express.Router();

// Get parsed dataset reference
const datasets = getRawDatasets();
const configList = getConfigChanges();

// GET /api/recovery-advisor/:serviceId - Failure Detection & AI Recovery Suggestion per Service
router.get('/recovery-advisor/:serviceId', (req, res) => {
  const serviceId = req.params.serviceId;
  const minute = parseInt(req.query.minute || '360', 10);
  const advisor = getRecoveryAdvisorForService(serviceId, minute);
  res.json(advisor);
});


// GET /api/services - Service health matrix at scrubbed minute
router.get('/services', (req, res) => {
  const minute = parseInt(req.query.minute || '360', 10);
  const incidentAnalysis = analyzeIncidentAtTime(minute);

  res.json({
    minute,
    timeFormatted: incidentAnalysis.timeFormatted,
    services: incidentAnalysis.serviceStats
  });
});

// GET /api/dependencies - Directed topology graph nodes & edges from dependency_map.json
router.get('/dependencies', (req, res) => {
  const minute = parseInt(req.query.minute || '360', 10);
  const incidentAnalysis = analyzeIncidentAtTime(minute);
  const depMap = datasets.dependencyMap;

  // Build nodes
  const nodes = Object.keys(depMap).map(svcId => {
    const stat = incidentAnalysis.serviceStats.find(s => s.serviceId === svcId) || {};
    return {
      id: svcId,
      name: svcId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      status: stat.status || 'healthy',
      latency: stat.currentLatency || 25,
      zScore: stat.zScore || 0,
      incidentRole: stat.incidentRole || 'unaffected'
    };
  });

  // Build edges from dependency map: if A depends on B, target=A, source=B (data/call flow direction)
  const edges = [];
  Object.keys(depMap).forEach(targetSvc => {
    const dependencies = depMap[targetSvc] || [];
    dependencies.forEach(sourceSvc => {
      edges.push({
        source: sourceSvc,
        target: targetSvc,
        type: "dependency"
      });
    });
  });

  res.json({
    nodes,
    edges
  });
});

// GET /api/config-changes - CSV event audit log
router.get('/config-changes', (req, res) => {
  const minute = parseInt(req.query.minute || '360', 10);
  const filtered = configList.map(cfg => ({
    ...cfg,
    hasOccurred: cfg.minuteOffset <= minute
  }));
  res.json(filtered);
});

// GET /api/metrics - Time-series metrics from metrics_stream.csv
router.get('/metrics', (req, res) => {
  const serviceId = req.query.serviceId;
  const minuteLimit = parseInt(req.query.minute || '360', 10);

  const filteredPoints = datasets.timeSeries
    .filter(t => t.minuteOffset <= minuteLimit)
    .map(t => {
      if (serviceId && t.services[serviceId]) {
        return {
          minuteOffset: t.minuteOffset,
          timeFormatted: t.timeFormatted,
          timestamp: t.timestamp,
          ...t.services[serviceId]
        };
      }
      return {
        minuteOffset: t.minuteOffset,
        timeFormatted: t.timeFormatted,
        timestamp: t.timestamp,
        services: t.services
      };
    });

  res.json(filteredPoints);
});

// GET /api/incidents - Active incident analysis
router.get('/incidents', (req, res) => {
  const minute = parseInt(req.query.minute || '360', 10);
  const incidentAnalysis = analyzeIncidentAtTime(minute);
  res.json(incidentAnalysis);
});

// GET /api/incident/:id
router.get('/incident/:id', (req, res) => {
  const minute = parseInt(req.query.minute || '360', 10);
  const incidentAnalysis = analyzeIncidentAtTime(minute);
  res.json({
    id: req.params.id || "INC-2026-HACKONEX",
    title: "Propagating Backbone Network Routing Cascade",
    severity: incidentAnalysis.cascadeRisk > 75 ? "SEV-1 CRITICAL" : "SEV-2 WARNING",
    ...incidentAnalysis
  });
});

// Specific Analysis API Endpoints
router.get('/analysis/anomalies', (req, res) => {
  const minute = parseInt(req.query.minute || '360', 10);
  const incidentAnalysis = analyzeIncidentAtTime(minute);
  res.json(incidentAnalysis.serviceStats.filter(s => s.firstAnomalyMinute !== null));
});

router.get('/analysis/cascade', (req, res) => {
  const minute = parseInt(req.query.minute || '360', 10);
  const incidentAnalysis = analyzeIncidentAtTime(minute);
  res.json({
    cascadeRisk: incidentAnalysis.cascadeRisk,
    cascadePath: incidentAnalysis.cascadePath
  });
});

router.get('/analysis/root-cause', (req, res) => {
  const minute = parseInt(req.query.minute || '360', 10);
  const incidentAnalysis = analyzeIncidentAtTime(minute);
  res.json(incidentAnalysis.rootCause);
});

router.get('/analysis/timeline', (req, res) => {
  const minute = parseInt(req.query.minute || '360', 10);
  const incidentAnalysis = analyzeIncidentAtTime(minute);
  res.json(incidentAnalysis.aiExplanation);
});

router.get('/analysis/intervention', (req, res) => {
  const minute = parseInt(req.query.minute || '360', 10);
  const incidentAnalysis = analyzeIncidentAtTime(minute);
  res.json({
    interventionWindow: incidentAnalysis.interventionWindow,
    earlyInterventionSimulation: incidentAnalysis.earlyInterventionSimulation
  });
});

export default router;
