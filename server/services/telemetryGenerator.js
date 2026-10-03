import { SERVICES, DEPENDENCIES } from '../data/servicesData.js';

// Generates time-series metrics from minute 0 to minute 360 (6 hours)
export function generateSixHourTelemetry() {
  const timeSeries = [];
  const TOTAL_MINUTES = 360; // 6 hours
  const STEP = 5; // 5 minute ticks -> 73 intervals

  // Helper seed pseudo-random number generator for reproducible noise
  const pseudoRandom = (seed) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  let seedCount = 1337;

  for (let min = 0; min <= TOTAL_MINUTES; min += STEP) {
    const timestamp = new Date(Date.parse("2026-09-25T04:00:00.000Z") + min * 60 * 1000).toISOString();
    const formattedTime = `T+${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

    const serviceMetrics = {};

    SERVICES.forEach(service => {
      const baseLat = service.baselineLatency;
      const stdDev = service.stdDev;
      const baseErr = service.baselineErrorRate;
      const baseRps = service.baselineRps;

      // Unrelated natural noise (Gaussian-like)
      const noiseFactor = (pseudoRandom(seedCount++) - 0.5) * 1.8 * stdDev;
      const rpsNoise = (pseudoRandom(seedCount++) - 0.5) * 0.08 * baseRps;

      let additionalLatency = 0;
      let additionalErrors = 0;
      let queueDepth = Math.floor(pseudoRandom(seedCount++) * 5);

      // --- CASCADING ANOMALY LOGIC ---
      // Incident starts after T+00:15 (cfg-8842 on db-proxy-primary)
      if (min >= 15) {
        const elapsed = min - 15; // Minutes since config change

        if (service.id === "db-proxy-primary") {
          // Originating Root Cause Service: Latency increases exponentially but quietly
          // 8ms baseline -> 30ms (T+1h) -> 110ms (T+2h) -> 350ms (T+4h) -> 890ms (T+6h)
          additionalLatency = Math.pow(elapsed / 42, 2.2) * 12;
          queueDepth += Math.floor(Math.pow(elapsed / 30, 1.8) * 15);
          if (elapsed > 200) additionalErrors = (elapsed - 200) * 0.04;
        } 
        else if (service.id === "inventory-service" || service.id === "catalog-service" || service.id === "user-service") {
          // Level-1 Direct Upstream Dependents of db-proxy-primary
          // Starts drifting around T+00:40
          if (elapsed > 25) {
            const depElapsed = elapsed - 25;
            additionalLatency = Math.pow(depElapsed / 45, 2.1) * 14;
            queueDepth += Math.floor(Math.pow(depElapsed / 32, 1.7) * 22);
            if (depElapsed > 180) additionalErrors = (depElapsed - 180) * 0.06;
          }
        } 
        else if (service.id === "order-service" || service.id === "billing-gateway" || service.id === "shipping-service") {
          // Level-2 Upstream Dependents (Order & Financial Orchestrators)
          // Starts drifting around T+01:20
          if (elapsed > 65) {
            const depElapsed = elapsed - 65;
            additionalLatency = Math.pow(depElapsed / 40, 2.0) * 16;
            queueDepth += Math.floor(Math.pow(depElapsed / 28, 1.9) * 35);
            if (depElapsed > 150) additionalErrors = (depElapsed - 150) * 0.12;
          }
        } 
        else if (service.id === "api-gateway" || service.id === "rate-limiter-sidecar") {
          // Level-3 Edge Router (The ultimate victim service!)
          // Stays nominal until T+02:30, then explodes exponentially as connection pools saturate
          if (elapsed > 135) {
            const edgeElapsed = elapsed - 135;
            additionalLatency = Math.pow(edgeElapsed / 35, 2.3) * 20;
            queueDepth += Math.floor(Math.pow(edgeElapsed / 20, 2.1) * 60);
            if (edgeElapsed > 100) additionalErrors = (edgeElapsed - 100) * 0.25;
          }
        } 
        else if (service.id === "auth-service" || service.id === "search-service") {
          // Mild secondary drift due to user-service slowdown
          if (elapsed > 90) {
            const secElapsed = elapsed - 90;
            additionalLatency = Math.pow(secElapsed / 50, 1.8) * 8;
            queueDepth += Math.floor(secElapsed * 0.3);
          }
        }
      }

      // Add a couple of unrelated noisy spikes on un-affected services (e.g. recommendation-service at min 120)
      if (service.id === "recommendation-service" && min >= 110 && min <= 140) {
        additionalLatency += 45 * Math.sin((min - 110) / 30 * Math.PI); // Temporary noise spike!
      }

      const currentLatency = Math.max(1, Math.round((baseLat + noiseFactor + additionalLatency) * 10) / 10);
      const currentRps = Math.max(10, Math.round(baseRps + rpsNoise));
      const currentErrorRate = Math.min(100, Math.max(baseErr, Math.round((baseErr + additionalErrors) * 100) / 100));

      // Calculate Z-Score anomaly index: (Current - Baseline) / StdDev
      const zScore = Math.round(((currentLatency - baseLat) / stdDev) * 100) / 100;

      // Status classification based on Z-score and error rate
      let status = "healthy";
      if (zScore > 5.0 || currentErrorRate > 5.0) {
        status = "critical";
      } else if (zScore > 2.0 || currentErrorRate > 0.5) {
        status = "degrading";
      }

      serviceMetrics[service.id] = {
        serviceId: service.id,
        name: service.name,
        timestamp,
        minuteOffset: min,
        latency: currentLatency,
        baselineLatency: baseLat,
        stdDev: stdDev,
        zScore: zScore,
        errorRate: currentErrorRate,
        baselineErrorRate: baseErr,
        rps: currentRps,
        queueDepth: queueDepth,
        status: status
      };
    });

    timeSeries.push({
      minuteOffset: min,
      timestamp,
      timeFormatted: formattedTime,
      services: serviceMetrics
    });
  }

  return timeSeries;
}
