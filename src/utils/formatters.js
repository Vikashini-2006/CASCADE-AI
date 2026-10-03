// Shared helper utilities for CASCADE // AI telemetry status resolution and formatting

export function getServiceStatus(svc) {
  if (!svc) return 'healthy';
  return svc.status || svc.metrics?.status || 'healthy';
}

export function getServiceLatency(svc) {
  if (!svc) return 0;
  return svc.currentLatency !== undefined ? svc.currentLatency : (svc.metrics?.latency !== undefined ? svc.metrics.latency : svc.baselineLatency || 0);
}

export function getServiceZScore(svc) {
  if (!svc) return 0;
  return svc.zScore !== undefined ? svc.zScore : (svc.metrics?.zScore !== undefined ? svc.metrics.zScore : 0);
}

export function getServiceQueueDepth(svc) {
  if (!svc) return 0;
  return svc.queueDepth !== undefined ? svc.queueDepth : (svc.metrics?.queueDepth !== undefined ? svc.metrics.queueDepth : 0);
}

export function getServiceErrorRate(svc) {
  if (!svc) return 0;
  return svc.errorRate !== undefined ? svc.errorRate : (svc.metrics?.errorRate !== undefined ? svc.metrics.errorRate : 0);
}
