// Configuration and deployment logs over the 6-hour timeline window
// NOTE: Routine entries look normal. The AI engine correlates timing + baseline drift.
export const CONFIG_CHANGES = [
  {
    id: "cfg-8839",
    timestamp: "2026-09-25T04:00:00.000Z",
    timeFormatted: "T+00:00 (04:00 UTC)",
    minuteOffset: 0,
    service: "search-service",
    changeType: "Feature Flag",
    description: "Enabled vector search re-ranking pipeline v2.4-alpha for 10% of query traffic.",
    author: "d.chen@platform.io",
    environment: "production-us-east",
    commitHash: "a7f391b",
    parameters: { flag: "vector_rerank_v2", rollout_percentage: 10 }
  },
  {
    id: "cfg-8840",
    timestamp: "2026-09-25T04:10:00.000Z",
    timeFormatted: "T+00:10 (04:10 UTC)",
    minuteOffset: 10,
    service: "api-gateway",
    changeType: "Rate Limit Tweak",
    description: "Adjusted global IP rate limiting threshold from 500 req/sec to 650 req/sec.",
    author: "sre-automation-bot",
    environment: "production-us-east",
    commitHash: "c4118e2",
    parameters: { burst_quota: 650, window_sec: 1 }
  },
  {
    id: "cfg-8842",
    timestamp: "2026-09-25T04:15:00.000Z",
    timeFormatted: "T+00:15 (04:15 UTC)",
    minuteOffset: 15,
    service: "db-proxy-primary",
    changeType: "Connection Pooler & TCP Tuning",
    description: "Optimized PgBouncer pooling parameters: max_connections reduced from 5000 to 1200, TCP keepalive idle set to 30s.",
    author: "m.rossi@db-reliability.io",
    environment: "production-us-east",
    commitHash: "8f9210c",
    parameters: { max_client_conn: 1200, reserve_pool: 5, server_idle_timeout: 30 }
  },
  {
    id: "cfg-8845",
    timestamp: "2026-09-25T04:45:00.000Z",
    timeFormatted: "T+00:45 (04:45 UTC)",
    minuteOffset: 45,
    service: "recommendation-service",
    changeType: "Model Deployment",
    description: "Deployed updated transformer embedding model v3.12-quantized.",
    author: "data-pipeline-ci",
    environment: "production-us-east",
    commitHash: "e104f98",
    parameters: { model_version: "v3.12-quantized", device: "cuda:0" }
  },
  {
    id: "cfg-8848",
    timestamp: "2026-09-25T05:30:00.000Z",
    timeFormatted: "T+01:30 (05:30 UTC)",
    minuteOffset: 90,
    service: "auth-service",
    changeType: "Cache TTL adjustment",
    description: "Extended JWT public key cache TTL from 300s to 1800s to lower Redis load.",
    author: "k.patel@security.io",
    environment: "production-us-east",
    commitHash: "7b220a1",
    parameters: { cache_ttl_sec: 1800 }
  },
  {
    id: "cfg-8851",
    timestamp: "2026-09-25T06:15:00.000Z",
    timeFormatted: "T+02:15 (06:15 UTC)",
    minuteOffset: 135,
    service: "notification-service",
    changeType: "Queue Buffer Size",
    description: "Increased async dispatch worker concurrency from 16 to 32 workers.",
    author: "comms-deploy-bot",
    environment: "production-us-east",
    commitHash: "d9910c4",
    parameters: { max_workers: 32, max_queue_depth: 5000 }
  },
  {
    id: "cfg-8855",
    timestamp: "2026-09-25T07:20:00.000Z",
    timeFormatted: "T+03:20 (07:20 UTC)",
    minuteOffset: 200,
    service: "shipping-service",
    changeType: "Partner API Timeout",
    description: "Increased carrier endpoint connection timeout from 2000ms to 4000ms.",
    author: "v.kumar@logistics.io",
    environment: "production-us-east",
    commitHash: "3f88b12",
    parameters: { timeout_ms: 4000, retry_attempts: 3 }
  },
  {
    id: "cfg-8860",
    timestamp: "2026-09-25T08:30:00.000Z",
    timeFormatted: "T+04:30 (08:30 UTC)",
    minuteOffset: 270,
    service: "order-service",
    changeType: "Circuit Breaker Config",
    description: "Lowered circuit breaker failure threshold from 50% to 35% error rate.",
    author: "platform-sre-bot",
    environment: "production-us-east",
    commitHash: "11299ab",
    parameters: { failure_rate_threshold: 35, slow_call_duration_threshold_ms: 1500 }
  }
];
