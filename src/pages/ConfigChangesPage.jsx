import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';
import { FileCode2, Search, Filter, AlertCircle, CheckCircle, Sparkles, User, GitCommit } from 'lucide-react';

export default function ConfigChangesPage() {
  const { configChanges, incident } = useIncident();
  const [search, setSearch] = useState('');

  const correlatedConfigId = incident?.rootCause?.probableConfigChange?.id;

  const filteredConfigs = configChanges.filter(c => 
    c.service.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase()) ||
    c.author.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-tight flex items-center gap-2">
            CONFIGURATION & DEPLOYMENT EVENT AUDIT LOG
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              AUDIT STREAM
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronological log of infrastructure deploys, feature flag toggles, and pool tuning events.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter config events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Main Audit Table */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-white/10 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Target Service</th>
                <th className="py-3 px-4">Change Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Author / System</th>
                <th className="py-3 px-4 text-right">AI Correlation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredConfigs.map((cfg) => {
                const isCorrelated = cfg.id === correlatedConfigId;

                return (
                  <tr
                    key={cfg.id}
                    className={`transition-colors hover:bg-slate-800/60 ${
                      isCorrelated ? 'bg-rose-950/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-cyan-300 whitespace-nowrap">
                      {cfg.timeFormatted}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-bold whitespace-nowrap flex items-center gap-1.5">
                      <GitCommit className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cfg.id}</span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      {cfg.service}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                        {cfg.changeType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 leading-relaxed max-w-md">
                      {cfg.description}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cfg.author}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isCorrelated ? (
                        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1.5 justify-end">
                          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                          98.4% ROOT CAUSE
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">
                          Nominal baseline
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
