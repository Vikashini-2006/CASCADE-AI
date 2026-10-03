import React, { useEffect, useRef } from 'react';
import { useIncident } from '../../context/IncidentContext';

export default function InfrastructureCanvasBackground() {
  const canvasRef = useRef(null);
  const { dependencies, services, currentMinute, theme } = useIncident();

  // Keep ref to latest dependencies, services, and theme for animation loop
  const stateRef = useRef({ dependencies, services, theme });
  useEffect(() => {
    stateRef.current = { dependencies, services, theme };
  }, [dependencies, services, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse Tracking with Smooth Lerp
    const mouse = {
      targetX: width / 2,
      targetY: height / 2,
      x: width / 2,
      y: height / 2,
      active: false
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // --- 1. PARTICLE FIELD CREATION ---
    const PARTICLE_COUNT = 90;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.3 + Math.random() * 0.7, // Depth factor
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: 1 + Math.random() * 2,
        baseAlpha: 0.15 + Math.random() * 0.35,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    // --- 2. DATA PACKETS ALONG PARTICLES ---
    const particlePackets = [];
    for (let i = 0; i < 15; i++) {
      particlePackets.push({
        p1Idx: Math.floor(Math.random() * PARTICLE_COUNT),
        p2Idx: Math.floor(Math.random() * PARTICLE_COUNT),
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.007
      });
    }

    // --- 3. MICROSERVICE ARCHITECTURE NODES & EDGES ---
    // Topological arrangement for microservice nodes in background
    let nodePositions = {};

    const updateNodePositions = () => {
      const nodes = stateRef.current.dependencies?.nodes || [];
      if (nodes.length === 0) return;

      const centerX = width * 0.65; // Right-hand side focus for background depth
      const centerY = height * 0.45;
      const radiusX = Math.min(width * 0.3, 420);
      const radiusY = Math.min(height * 0.32, 280);

      nodes.forEach((node, index) => {
        const angle = (index / nodes.length) * Math.PI * 2;
        nodePositions[node.id] = {
          x: centerX + Math.cos(angle) * radiusX,
          y: centerY + Math.sin(angle) * radiusY,
          baseX: centerX + Math.cos(angle) * radiusX,
          baseY: centerY + Math.sin(angle) * radiusY,
          pulse: Math.random() * Math.PI * 2
        };
      });
    };

    updateNodePositions();

    // Edge packets for service dependency flow
    const edgePackets = [];
    for (let i = 0; i < 25; i++) {
      edgePackets.push({
        edgeIdx: i,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.008
      });
    }

    let time = 0;

    // --- ANIMATION LOOP ---
    const render = () => {
      time += 0.016;

      // Lerp Mouse Position
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const isLight = stateRef.current.theme === 'light';

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Mouse Parallax Offsets
      const offsetX = (mouse.x - width / 2) * 0.015;
      const offsetY = (mouse.y - height / 2) * 0.015;

      // Soft Mouse Illumination Radial Glow
      if (mouse.active) {
        const radGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 350
        );
        if (isLight) {
          radGlow.addColorStop(0, 'rgba(6, 182, 212, 0.07)');
          radGlow.addColorStop(1, 'rgba(248, 250, 252, 0)');
        } else {
          radGlow.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
          radGlow.addColorStop(0.5, 'rgba(59, 130, 246, 0.03)');
          radGlow.addColorStop(1, 'rgba(4, 8, 18, 0)');
        }
        ctx.fillStyle = radGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 350, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- 1. RENDER INFRASTRUCTURE PARTICLE FIELD & CONNECTIVITY ---
      ctx.lineWidth = 0.5;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // Move Particles
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Parallax coordinates
        const px = p.x + offsetX * p.z;
        const py = p.y + offsetY * p.z;

        // Mouse proximity distance
        const dxMouse = mouse.x - px;
        const dyMouse = mouse.y - py;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        const mouseHighlight = distMouse < 180 ? (1 - distMouse / 180) * 0.4 : 0;

        // Pulse Alpha
        const alpha = Math.min(1, p.baseAlpha + Math.sin(time * 2 + p.pulseOffset) * 0.1 + mouseHighlight);

        // Draw Particle
        ctx.fillStyle = isLight 
          ? `rgba(14, 165, 233, ${alpha * 0.7})` 
          : `rgba(6, 182, 212, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size * p.z, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const p2 = particles[j];
          const p2x = p2.x + offsetX * p2.z;
          const p2y = p2.y + offsetY * p2.z;

          const dx = px - p2x;
          const dy = py - p2y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.12 * Math.min(p.z, p2.z) + (mouseHighlight * 0.2);
            ctx.strokeStyle = isLight 
              ? `rgba(148, 163, 184, ${lineAlpha * 1.5})` 
              : `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(p2x, p2y);
            ctx.stroke();
          }
        }
      }

      // Draw Telemetry Packets along particle connections
      particlePackets.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress > 1) {
          pkt.progress = 0;
          pkt.p1Idx = Math.floor(Math.random() * PARTICLE_COUNT);
          pkt.p2Idx = Math.floor(Math.random() * PARTICLE_COUNT);
        }

        const p1 = particles[pkt.p1Idx];
        const p2 = particles[pkt.p2Idx];

        if (p1 && p2) {
          const p1x = p1.x + offsetX * p1.z;
          const p1y = p1.y + offsetY * p1.z;
          const p2x = p2.x + offsetX * p2.z;
          const p2y = p2.y + offsetY * p2.z;

          const dx = p2x - p1x;
          const dy = p2y - p1y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            const curX = p1x + dx * pkt.progress;
            const curY = p1y + dy * pkt.progress;

            ctx.fillStyle = isLight ? 'rgba(2, 132, 199, 0.6)' : 'rgba(34, 211, 238, 0.8)';
            ctx.beginPath();
            ctx.arc(curX, curY, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // --- 2. RENDER LIVE MICROSERVICE DEPENDENCY NETWORK LAYER ---
      const edges = stateRef.current.dependencies?.edges || [];
      const serviceStats = stateRef.current.services || [];

      // Build status map from real telemetry
      const serviceStatusMap = {};
      serviceStats.forEach(s => {
        const id = s.serviceId || s.id;
        const status = s.status || s.metrics?.status || 'healthy';
        serviceStatusMap[id] = status;
      });

      // Ensure positions are synchronized if node count changes
      if (Object.keys(nodePositions).length !== (stateRef.current.dependencies?.nodes?.length || 0)) {
        updateNodePositions();
      }

      // Draw Edges (Dependencies)
      edges.forEach((edge) => {
        const sourcePos = nodePositions[edge.source];
        const targetPos = nodePositions[edge.target];

        if (sourcePos && targetPos) {
          const sx = sourcePos.x + offsetX * 1.2;
          const sy = sourcePos.y + offsetY * 1.2;
          const tx = targetPos.x + offsetX * 1.2;
          const ty = targetPos.y + offsetY * 1.2;

          const targetStatus = serviceStatusMap[edge.target] || 'healthy';
          const sourceStatus = serviceStatusMap[edge.source] || 'healthy';
          const isCriticalEdge = targetStatus === 'critical' || sourceStatus === 'critical';
          const isDegradingEdge = targetStatus === 'degrading' || sourceStatus === 'degrading';

          let strokeColor;
          if (isCriticalEdge) {
            strokeColor = isLight ? 'rgba(239, 68, 68, 0.4)' : 'rgba(244, 63, 94, 0.4)';
          } else if (isDegradingEdge) {
            strokeColor = isLight ? 'rgba(245, 158, 11, 0.4)' : 'rgba(251, 191, 36, 0.4)';
          } else {
            strokeColor = isLight ? 'rgba(148, 163, 184, 0.25)' : 'rgba(56, 189, 248, 0.18)';
          }

          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = isCriticalEdge ? 1.5 : 0.8;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        }
      });

      // Draw Flowing Data Packets on Dependency Edges
      edgePackets.forEach((pkt, idx) => {
        if (edges.length === 0) return;
        const edge = edges[idx % edges.length];
        if (!edge) return;

        const sourcePos = nodePositions[edge.source];
        const targetPos = nodePositions[edge.target];

        if (sourcePos && targetPos) {
          const targetStatus = serviceStatusMap[edge.target] || 'healthy';
          const speedMult = targetStatus === 'critical' ? 2.5 : targetStatus === 'degrading' ? 1.5 : 1.0;

          pkt.progress += pkt.speed * speedMult;
          if (pkt.progress > 1) pkt.progress = 0;

          const sx = sourcePos.x + offsetX * 1.2;
          const sy = sourcePos.y + offsetY * 1.2;
          const tx = targetPos.x + offsetX * 1.2;
          const ty = targetPos.y + offsetY * 1.2;

          const px = sx + (tx - sx) * pkt.progress;
          const py = sy + (ty - sy) * pkt.progress;

          const packetColor = targetStatus === 'critical' ? '#F43F5E' : targetStatus === 'degrading' ? '#FBBF24' : '#22D3EE';

          ctx.fillStyle = packetColor;
          ctx.beginPath();
          ctx.arc(px, py, targetStatus === 'critical' ? 2.5 : 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Service Nodes
      Object.keys(nodePositions).forEach((nodeId) => {
        const node = nodePositions[nodeId];
        const nx = node.x + offsetX * 1.2;
        const ny = node.y + offsetY * 1.2;

        const status = serviceStatusMap[nodeId] || 'healthy';
        const isRootCause = nodeId === 'network-gateway';

        // Mouse Hover Proximity
        const dxMouse = mouse.x - nx;
        const dyMouse = mouse.y - ny;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        const isHovered = distMouse < 60;

        let nodeColor, ringColor, radius;
        if (isRootCause) {
          nodeColor = '#F43F5E';
          ringColor = 'rgba(244, 63, 94, 0.4)';
          radius = 5.5;
        } else if (status === 'critical') {
          nodeColor = '#F43F5E';
          ringColor = 'rgba(244, 63, 94, 0.35)';
          radius = 4.5;
        } else if (status === 'degrading') {
          nodeColor = '#FBBF24';
          ringColor = 'rgba(251, 191, 36, 0.3)';
          radius = 4;
        } else {
          nodeColor = isLight ? '#0284C7' : '#38BDF8';
          ringColor = isLight ? 'rgba(2, 132, 199, 0.2)' : 'rgba(56, 189, 248, 0.2)';
          radius = 3.5;
        }

        if (isHovered) {
          radius += 2.5;
        }

        // Pulse Aura Ring
        const pulseSize = radius + 3 + Math.sin(time * 3 + node.pulse) * (status === 'critical' ? 4 : 2);
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(nx, ny, pulseSize, 0, Math.PI * 2);
        ctx.stroke();

        // Core Solid Node
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(nx, ny, radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle Node Label when hovered or for key root node
        if (isHovered || isRootCause || status !== 'healthy') {
          ctx.font = '10px monospace';
          ctx.fillStyle = isLight ? '#0F172A' : '#E2E8F0';
          ctx.fillText(nodeId, nx + radius + 5, ny + 3);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
      style={{ opacity: 0.85 }}
    />
  );
}
