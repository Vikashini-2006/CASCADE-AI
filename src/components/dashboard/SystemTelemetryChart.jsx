import React, { useState, useEffect } from 'react';
import { useIncident } from '../../context/IncidentContext';
import { apiService } from '../../services/api';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  Legend 
} from 'recharts';
import { Activity, ShieldAlert, FileCode2, Clock, CheckCircle2 } from 'lucide-react';

const SERVICE_COLORS = {
  'network-gateway': '#06B6D4', // Cyan (Root cause)
  'auth-service': '#3B82F6',    // Blue
  'session-store': '#8B5CF6',   // Purple
  'checkout-service': '#F59E0B', // Amber
  'payments-service': '#EF4444', // Red (Decoy)
  'notifications-service': '#EC4899' // Pink
};

export default function SystemTelemetryChart() {
  const { currentMinute } = useIncident();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState({
    'network-gateway': true,
    'auth-service': true,
    'session-store': true,
    'checkout-service': true,
    'payments-service': true
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiService.getMetrics(currentMinute).then(points => {
      if (!isMounted) return;
      
      const formatted = points.map(pt => {
        const item = {
          minuteOffset: pt.minuteOffset,
          timeFormatted: pt.timeFormatted,
        };
        if (pt.services) {
          Object.keys(pt.services).forEach(svcId => {
            item[svcId] = Math.round(pt.services[svcId].latency || pt.services[svcId].currentLatency || 0);
          });
        }
        return item;
      });

      setChartData(formatted);
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, [currentMinute]);

  const toggleService = (svcId) => {
    setSelectedServices(prev => ({
      ...prev,
      [svcId]: !prev[svcId]
    }));
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 backdrop-blur-md shadow-xl">
      {/* Header & Milestone Legends */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              System-Wide Propagation Telemetry (Latency ms)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              0m &rarr; {currentMinute}m
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Correlating root config change (<span className="text-cyan-300">cfg-1003</span>), latency drift, and rejected sabotage decoy (<span className="text-rose-400">cfg-2001</span>).
          </p>
        </div>

        {/* Milestone Badge Pill Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            T+00:42 cfg-1003
          </span>
          <span className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            T+01:15 Intervention
          </span>
          <span className="flex items-center gap-1 px-2 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            T+01:35 Decoy cfg-2001
          </span>
        </div>
      </div>

      {/* Service Toggles */}
      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
        <span className="text-[11px] text-slate-500 mr-1">Toggle Series:</span>
        {Object.keys(SERVICE_COLORS).map(svcId => (
          <button
            key={svcId}
            onClick={() => toggleService(svcId)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all flex items-center gap-1.5 ${
              selectedServices[svcId] 
                ? 'bg-slate-800 text-slate-100 border-white/20' 
                : 'bg-slate-950/60 text-slate-600 border-white/5 opacity-50'
            }`}
          >
            <span 
              className="w-2.5 h-2.5 rounded-full inline-block" 
              style={{ backgroundColor: SERVICE_COLORS[svcId] }} 
            />
            <span>{svcId}</span>
          </button>
        ))}
      </div>

      {/* Recharts Live Chart Container */}
      <div className="h-72 w-full pt-2">
        {loading && chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">
            Streaming real dataset metrics...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="timeFormatted" 
                stroke="#64748B" 
                fontSize={10} 
                tickLine={false}
                fontFamily="monospace"
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={10} 
                tickLine={false}
                fontFamily="monospace"
                unit="ms"
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#0B0F17', 
                  borderColor: '#334155', 
                  borderRadius: '12px', 
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
                itemStyle={{ padding: '2px 0' }}
              />

              {/* Reference Lines for Key Milestone Events */}
              <ReferenceLine 
                x="T+00:42" 
                stroke="#06B6D4" 
                strokeDasharray="4 4" 
                label={{ value: "cfg-1003", fill: "#06B6D4", fontSize: 10, position: "top" }} 
              />
              <ReferenceLine 
                x="T+01:15" 
                stroke="#10B981" 
                strokeDasharray="4 4" 
                label={{ value: "Intervention", fill: "#10B981", fontSize: 10, position: "top" }} 
              />
              <ReferenceLine 
                x="T+01:35" 
                stroke="#EF4444" 
                strokeDasharray="4 4" 
                label={{ value: "Decoy cfg-2001", fill: "#EF4444", fontSize: 10, position: "top" }} 
              />

              {/* Line per Microservice */}
              {Object.keys(SERVICE_COLORS).map(svcId => (
                selectedServices[svcId] && (
                  <Line
                    key={svcId}
                    type="monotone"
                    dataKey={svcId}
                    stroke={SERVICE_COLORS[svcId]}
                    strokeWidth={svcId === 'network-gateway' ? 3 : 2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
