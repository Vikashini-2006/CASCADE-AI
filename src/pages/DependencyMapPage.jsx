import React, { useState } from 'react';
import InteractiveDependencyGraph from '../components/topology/InteractiveDependencyGraph';
import ServiceDetailDrawer from '../components/services/ServiceDetailDrawer';

export default function DependencyMapPage() {
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-mono font-bold text-white tracking-tight flex items-center gap-2">
          INTERACTIVE DEPENDENCY GRAPH TOPOLOGY
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            DIRECTED DAG
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Trace propagation paths from downstream edge entrypoints to upstream datastore root causes.
        </p>
      </div>

      <InteractiveDependencyGraph onSelectService={(id) => setSelectedServiceId(id)} />

      {selectedServiceId && (
        <ServiceDetailDrawer
          serviceId={selectedServiceId}
          onClose={() => setSelectedServiceId(null)}
        />
      )}
    </div>
  );
}
