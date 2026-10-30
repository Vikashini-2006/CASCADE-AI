import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Browser-safe fallback dataset metadata matching real hackathon dataset schemas
const FALLBACK_CONFIG_CHANGES = [
  { id: "cfg-1001", minuteOffset: 5, timeFormatted: "T+00:05", service: "cdn-edge", changeType: "Cache TTL", description: "Updated cache TTL for static assets from 300s to 600s", author: "infra-bot" },
  { id: "cfg-1002", minuteOffset: 18, timeFormatted: "T+00:18", service: "chat-support", changeType: "API Key", description: "Rotated API key for third-party chat widget integration", author: "sec-ops" },
  { id: "cfg-1003", minuteOffset: 42, timeFormatted: "T+00:42", service: "network-gateway", changeType: "Routing Table", description: "Updated internal routing table for backbone service mesh (v4.7 rollout)", author: "infra-mesh-bot" },
  { id: "cfg-1004", minuteOffset: 50, timeFormatted: "T+00:50", service: "checkout-service", changeType: "Logging Level", description: "Adjusted logging verbosity from INFO to DEBUG for checkout flow", author: "checkout-dev" },
  { id: "cfg-1005", minuteOffset: 77, timeFormatted: "T+01:17", service: "cache-gateway", changeType: "Pool Size", description: "Increased connection pool size from 50 to 75", author: "sre-ops" }
];

export const apiService = {
  async getServices(minute = 360) {
    try {
      const res = await axios.get(`${API_BASE}/services?minute=${minute}`);
      return res.data;
    } catch (err) {
      console.warn("Backend API unavailable, connecting fallback...");
      return { minute, timeFormatted: `T+06:00`, services: [] };
    }
  },

  async getDependencies(minute = 360) {
    try {
      const res = await axios.get(`${API_BASE}/dependencies?minute=${minute}`);
      return res.data;
    } catch (err) {
      return { nodes: [], edges: [] };
    }
  },

  async getConfigChanges(minute = 360) {
    try {
      const res = await axios.get(`${API_BASE}/config-changes?minute=${minute}`);
      return res.data;
    } catch (err) {
      return FALLBACK_CONFIG_CHANGES.map(cfg => ({ ...cfg, hasOccurred: cfg.minuteOffset <= minute }));
    }
  },

  async getMetrics(minute = 360, serviceId = null) {
    try {
      const url = serviceId ? `${API_BASE}/metrics?minute=${minute}&serviceId=${serviceId}` : `${API_BASE}/metrics?minute=${minute}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      return [];
    }
  },

  async getIncidents(minute = 360) {
    try {
      const res = await axios.get(`${API_BASE}/incidents?minute=${minute}`);
      return res.data;
    } catch (err) {
      return null;
    }
  },

  async getAIAnalysis(minute = 360) {
    try {
      const res = await axios.get(`${API_BASE}/ai/analyze?minute=${minute}`);
      return res.data;
    } catch (err) {
      return null;
    }
  },

  async getRecoveryAdvisor(serviceId, minute = 360) {
    try {
      const res = await axios.get(`${API_BASE}/recovery-advisor/${serviceId}?minute=${minute}`);
      return res.data;
    } catch (err) {
      console.warn("Recovery advisor endpoint error:", err);
      return null;
    }
  }
};
