import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

const IncidentContext = createContext();

export function IncidentProvider({ children }) {
  // Timeline playback state (0 to 360 minutes)
  const [currentMinute, setCurrentMinute] = useState(360);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(2); // 2x speed

  // Theme State ('dark' | 'light') persisted in localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cascade_theme') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('cascade_theme', nextTheme);
      return nextTheme;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({
    name: "Alex Mercer",
    role: "Lead SRE Architect",
    email: "alex.mercer@cascade.ai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  });

  // Telemetry Data State
  const [services, setServices] = useState([]);
  const [dependencies, setDependencies] = useState({ nodes: [], edges: [] });
  const [configChanges, setConfigChanges] = useState([]);
  const [incident, setIncident] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // UI Selection State
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [healthFilter, setHealthFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch telemetry payload based on scrubbed minute
  const refreshData = useCallback(async (minute) => {
    try {
      const [svcData, depData, cfgData, incData, aiData] = await Promise.all([
        apiService.getServices(minute),
        apiService.getDependencies(minute),
        apiService.getConfigChanges(minute),
        apiService.getIncidents(minute),
        apiService.getAIAnalysis(minute)
      ]);

      setServices(svcData.services || []);
      setDependencies(depData || { nodes: [], edges: [] });
      setConfigChanges(cfgData || []);
      setIncident(incData || null);
      setAiAnalysis(aiData || null);
    } catch (err) {
      console.error("Error refreshing CASCADE telemetry context:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update telemetry when minute scrub changes
  useEffect(() => {
    refreshData(currentMinute);
  }, [currentMinute, refreshData]);

  // Automated Replay Timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentMinute((prev) => {
          if (prev >= 360) {
            setIsPlaying(false);
            return 360;
          }
          return Math.min(360, prev + 5);
        });
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  const login = (email, password) => {
    setIsAuthenticated(true);
    setUser({
      name: "SRE Command Officer",
      role: "Lead Observability Engineer",
      email: email || "sre.admin@cascade.ai",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = {
    currentMinute,
    setCurrentMinute,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    theme,
    toggleTheme,
    isAuthenticated,
    user,
    login,
    logout,
    services,
    dependencies,
    configChanges,
    incident,
    aiAnalysis,
    selectedServiceId,
    setSelectedServiceId,
    searchQuery,
    setSearchQuery,
    healthFilter,
    setHealthFilter,
    loading
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncident() {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error("useIncident must be used within an IncidentProvider");
  }
  return context;
}
