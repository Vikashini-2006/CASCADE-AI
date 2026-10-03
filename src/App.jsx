import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { IncidentProvider, useIncident } from './context/IncidentContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import TimeScrubber from './components/layout/TimeScrubber';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ServiceHealthPage from './pages/ServiceHealthPage';
import DependencyMapPage from './pages/DependencyMapPage';
import ConfigChangesPage from './pages/ConfigChangesPage';
import IncidentOverviewPage from './pages/IncidentOverviewPage';
import IncidentReplayPage from './pages/IncidentReplayPage';
import AICopilotPage from './pages/AICopilotPage';

function AppLayout() {
  const { isAuthenticated } = useIncident();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-cascade-atmosphere text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
      {/* Soft Ambient Floating Glow Orbs for Visual Depth */}
      <div className="absolute top-[-100px] left-[20%] w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-ambient-1" />
      <div className="absolute top-[35%] right-[-100px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none animate-ambient-2" />
      <div className="absolute bottom-[-100px] left-[30%] w-[600px] h-[600px] bg-cyan-600/08 rounded-full blur-[150px] pointer-events-none animate-ambient-1" />

      {/* Top Header */}
      <Header />

      {/* Main Body Grid */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto bg-grid-pattern relative">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/services" element={<ServiceHealthPage />} />
            <Route path="/dependencies" element={<DependencyMapPage />} />
            <Route path="/incidents" element={<IncidentOverviewPage />} />
            <Route path="/replay" element={<IncidentReplayPage />} />
            <Route path="/config-changes" element={<ConfigChangesPage />} />
            <Route path="/ai-copilot" element={<AICopilotPage />} />
          </Routes>
        </main>
      </div>

      {/* Fixed Bottom Time Scrubber Controller */}
      <TimeScrubber />
    </div>
  );
}

export default function App() {
  return (
    <IncidentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </IncidentProvider>
  );
}
