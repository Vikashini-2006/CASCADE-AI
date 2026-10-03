import React from 'react';
import { useIncident } from '../../context/IncidentContext';
import { Play, Pause, RotateCcw, FastForward, SkipBack, SkipForward, Clock } from 'lucide-react';

export default function TimeScrubber() {
  const { 
    currentMinute, 
    setCurrentMinute, 
    isPlaying, 
    setIsPlaying, 
    playbackSpeed, 
    setPlaybackSpeed,
    incident
  } = useIncident();

  const formattedHours = String(Math.floor(currentMinute / 60)).padStart(2, '0');
  const formattedMins = String(currentMinute % 60).padStart(2, '0');

  // Key Incident Markers on timeline slider
  const markers = [
    { minute: 0, label: "T+00:00 Initial Nominal State" },
    { minute: 42, label: "T+00:42 cfg-1003 Deployed" },
    { minute: 48, label: "T+00:48 1st Anomaly (network-gateway)" },
    { minute: 75, label: "T+01:15 Recommended Intervention (10:42 AM)" },
    { minute: 140, label: "T+02:20 Upstream Degradation" },
    { minute: 330, label: "T+05:30 Severe Platform Outage" }
  ];

  return (
    <div className="bg-[#0B0F17]/95 dark:bg-[#0B0F17]/95 light:bg-white/95 border-t border-white/10 dark:border-white/10 light:border-slate-200 px-6 py-3 flex flex-col gap-2 relative z-30 transition-colors shadow-lg">
      <div className="flex items-center justify-between text-xs">
        {/* Scrubber Label & Current Minute */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-cyan-100 border border-cyan-500/30 dark:border-cyan-500/30 light:border-cyan-400 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 font-mono font-semibold">
            <Clock className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-400 light:text-cyan-700" />
            T+{formattedHours}:{formattedMins}
          </span>
          <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono text-[11px]">
            {currentMinute === 0 && "Baseline Traffic — System Nominal"}
            {currentMinute > 0 && currentMinute < 42 && "Routine Operation"}
            {currentMinute >= 42 && currentMinute < 48 && "cfg-1003 Deployed on network-gateway"}
            {currentMinute >= 48 && currentMinute < 75 && "Subtle micro-latency drift beginning (+2.4σ)"}
            {currentMinute >= 75 && currentMinute < 140 && "Optimal SRE Intervention Window (10:42 AM)"}
            {currentMinute >= 140 && currentMinute < 330 && "Cascading queue saturation spreading upstream"}
            {currentMinute >= 330 && "Platform-wide Connection Pool Saturation & Outage"}
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMinute(0)}
            title="Reset to T+00:00"
            className="p-1.5 rounded bg-slate-800 dark:bg-slate-800 light:bg-slate-200 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => setCurrentMinute(Math.max(0, currentMinute - 15))}
            title="-15 minutes"
            className="p-1.5 rounded bg-slate-800 dark:bg-slate-800 light:bg-slate-200 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-800 transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1 rounded font-mono font-semibold text-xs flex items-center gap-1.5 transition-all ${
              isPlaying 
                ? 'bg-amber-500/20 text-amber-300 dark:text-amber-300 light:text-amber-800 border border-amber-500/40 hover:bg-amber-500/30' 
                : 'bg-cyan-500/20 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 border border-cyan-500/40 hover:bg-cyan-500/30'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'PAUSE REPLAY' : 'PLAY SIMULATION'}</span>
          </button>

          <button
            onClick={() => setCurrentMinute(Math.min(360, currentMinute + 15))}
            title="+15 minutes"
            className="p-1.5 rounded bg-slate-800 dark:bg-slate-800 light:bg-slate-200 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-800 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 border-l border-white/10 dark:border-white/10 light:border-slate-300 pl-2">
            {[1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  playbackSpeed === s 
                    ? 'bg-cyan-500 text-slate-950 font-bold' 
                    : 'bg-slate-900 dark:bg-slate-900 light:bg-slate-200 text-slate-400 dark:text-slate-400 light:text-slate-700 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Range Slider Track */}
      <div className="relative pt-1 pb-2">
        <input
          type="range"
          min="0"
          max="360"
          step="5"
          value={currentMinute}
          onChange={(e) => setCurrentMinute(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 dark:bg-slate-800 light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />

        {/* Marker Dots on Slider Track */}
        <div className="absolute top-1 left-0 right-0 flex justify-between pointer-events-none px-1">
          {markers.map((m) => {
            const pct = (m.minute / 360) * 100;
            const isReached = currentMinute >= m.minute;
            return (
              <div
                key={m.minute}
                style={{ left: `${pct}%` }}
                className="absolute -top-0.5 -translate-x-1/2 flex flex-col items-center group cursor-pointer pointer-events-auto"
                onClick={() => setCurrentMinute(m.minute)}
              >
                <div className={`w-2 h-2 rounded-full transition-all ${
                  isReached ? 'bg-cyan-400 ring-2 ring-cyan-500/50' : 'bg-slate-600 dark:bg-slate-600 light:bg-slate-400'
                }`} />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1 text-[9px] font-mono whitespace-nowrap bg-slate-900 dark:bg-slate-900 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-300 px-2 py-0.5 rounded text-cyan-300 dark:text-cyan-300 light:text-cyan-800 pointer-events-none shadow-md">
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
