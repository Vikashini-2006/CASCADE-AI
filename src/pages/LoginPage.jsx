import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';
import { Activity, ShieldCheck, Lock, Mail, ArrowRight, Server, CheckCircle, GitFork } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useIncident();
  const navigate = useNavigate();
  const [email, setEmail] = useState('sre.lead@cascade.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    navigate('/');
  };

  const handleDemoLogin = () => {
    login('demo.judge@hackathon.io', 'demo123');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cascade-atmosphere text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Soft Ambient Radial Glow Spheres */}
      <div className="absolute top-[10%] left-[20%] w-[650px] h-[650px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none animate-ambient-1" />
      <div className="absolute bottom-[10%] right-[15%] w-[600px] h-[600px] bg-indigo-600/18 rounded-full blur-[140px] pointer-events-none animate-ambient-2" />
      <div className="absolute top-[50%] left-[60%] w-[450px] h-[450px] bg-cyan-500/12 rounded-full blur-[130px] pointer-events-none animate-ambient-1" />

      {/* Abstract Abstract Topology Background Overlay (Services -> Dependencies -> Cascade) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <g stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1.2" fill="none" strokeDasharray="4 6">
          <path d="M 100 200 Q 300 150 500 350 T 900 250" />
          <path d="M 200 600 Q 450 400 700 650 T 1100 500" />
          <path d="M 50 450 Q 350 550 650 300 T 1200 400" />
        </g>
        <g fill="rgba(6, 182, 212, 0.4)">
          <circle cx="100" cy="200" r="4" />
          <circle cx="500" cy="350" r="5" />
          <circle cx="900" cy="250" r="4" />
          <circle cx="450" cy="400" r="6" />
          <circle cx="700" cy="650" r="4" />
        </g>
      </svg>

      {/* Top Header Bar */}
      <header className="px-8 py-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-mono font-bold text-lg text-white tracking-wider">CASCADE // AI</span>
            <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
              RELIABILITY ENGINE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900/90 border border-white/10 px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Security Engine Operational</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10 relative">
        <div className="w-full max-w-md bg-slate-900/90 border border-white/12 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-xs border border-cyan-500/30">
              <Server className="w-3.5 h-3.5 text-cyan-400" /> Enterprise SRE Command Center
            </div>
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">Authenticate Access</h1>
            <p className="text-xs text-slate-400 font-mono">Enter SRE credentials to view telemetry incident command.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">SRE Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">Security Passkey / Token</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 font-mono">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-white/10 text-cyan-500 focus:ring-0"
                />
                Remember SSO Token
              </label>

              <span className="text-cyan-400 font-mono cursor-pointer hover:underline">SAML SSO</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
            >
              <span>SIGN IN TO COMMAND CENTER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Shortcut */}
          <div className="pt-4 border-t border-white/10 text-center space-y-3">
            <span className="text-xs font-mono text-slate-400">Judge / Reviewer Access:</span>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>1-CLICK DEMO LOGIN (BYPASS AUTH)</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-4 text-center text-xs font-mono text-slate-500 border-t border-white/5 z-10 relative">
        CASCADE // AI Observability Platform • Powered by Neural Root Cause Inference
      </footer>
    </div>
  );
}
