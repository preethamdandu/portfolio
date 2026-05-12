"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const roles = ['ADMIN', 'USER', 'AUDIT', 'API'];
const perms = ['READ', 'WRITE', 'DELETE', 'EXEC'];
const rbacMatrix = [
  [true, true, true, true],
  [true, true, false, false],
  [true, false, false, false],
  [true, true, false, true],
];

export default function SecurityMatrix() {
  const [litCell, setLitCell] = useState({ r: 0, c: 0 });
  const [anomalyScore, setAnomalyScore] = useState(0.12);
  const [fraudAlert, setFraudAlert] = useState(false);
  const [jwtOffset, setJwtOffset] = useState(0);

  const jwtToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  useEffect(() => {
    // Scan RBAC matrix sequentially to mimic a system scan
    const scanInterval = setInterval(() => {
      setLitCell(prev => {
        let nc = prev.c + 1;
        let nr = prev.r;
        if (nc > 3) {
           nc = 0;
           nr = (nr + 1) % 4;
        }
        return { r: nr, c: nc };
      });
    }, 300);

    // Jitter anomaly score
    const anomalyInterval = setInterval(() => {
      setAnomalyScore(prev => {
        const next = prev + (Math.random() - 0.48) * 0.08;
        if (next > 0.75) {
          setFraudAlert(true);
          setTimeout(() => {
            setFraudAlert(false);
            setAnomalyScore(0.12);
          }, 2000);
          return 0.85;
        }
        return Math.max(0.05, Math.min(0.7, next));
      });
    }, 400);

    // Scroll JWT
    const jwtInterval = setInterval(() => {
      setJwtOffset(prev => (prev + 1) % 80);
    }, 150);

    return () => {
      clearInterval(scanInterval);
      clearInterval(anomalyInterval);
      clearInterval(jwtInterval);
    };
  }, []);

  return (
    <div className="w-full h-full p-6 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col overflow-hidden relative font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 text-[10px] text-[var(--ink-secondary)]">
        <span>FINGUARD · SECURITY DASHBOARD</span>
        <span className={fraudAlert ? 'text-[var(--warn)] animate-pulse' : 'text-[var(--signal)]'}>
          {fraudAlert ? '⚠ THREAT ANOMALY DETECTED' : '● SYSTEM SECURE'}
        </span>
      </div>

      {/* JWT Token scroll */}
      <div className="bg-[var(--bg-void)] border border-[var(--hairline)] p-2 mb-4 overflow-hidden h-6 flex items-center">
        <div className="whitespace-nowrap text-[9px] text-[var(--ink-tertiary)]" style={{ transform: `translateX(-${jwtOffset * 3}px)` }}>
          [ENC] AUTH_BEARER: {jwtToken} {jwtToken}
        </div>
      </div>

      {/* RBAC Matrix */}
      <div className="flex-grow flex flex-col">
        <div className="text-[8px] text-[var(--ink-tertiary)] mb-2 tracking-widest flex justify-between">
          <span>RBAC LOGICAL MATRIX</span>
          <span className="opacity-50">SCANNING...</span>
        </div>
        <div className="flex-grow border border-[var(--hairline)] bg-[var(--bg-void)] p-3 relative overflow-hidden">
          
          {/* Overlay scanning line */}
          <motion.div 
            className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent to-[rgba(198,255,61,0.05)] border-b border-[var(--signal)] opacity-50 z-20 pointer-events-none"
            animate={{ top: ['-20%', '120%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Column headers */}
          <div className="flex mb-2">
            <div className="w-12" />
            {perms.map(p => (
              <div key={p} className="flex-1 text-center text-[8px] text-[var(--ink-tertiary)]">{p}</div>
            ))}
          </div>
          {/* Rows */}
          <div className="relative z-10">
            {roles.map((role, ri) => (
              <div key={role} className="flex items-center mb-2">
                <div className="w-12 text-[8px] text-[var(--ink-secondary)]">{role}</div>
                {perms.map((_, ci) => {
                  const isGranted = rbacMatrix[ri][ci];
                  const isScanning = litCell.r === ri && litCell.c === ci;
                  
                  // if fraudAlert AND this is a denied node, make it pulse red
                  const isThreat = fraudAlert && !isGranted;

                  return (
                    <div key={ci} className="flex-1 flex justify-center">
                      <motion.div
                        className={`w-6 h-6 rounded-sm border flex items-center justify-center text-[9px] transition-all duration-300 ${
                          isThreat 
                            ? 'border-[var(--warn)] bg-[rgba(255,138,61,0.2)] text-[var(--warn)] scale-110 shadow-[0_0_10px_var(--warn)]'
                            : isScanning
                            ? 'border-[var(--signal)] bg-[var(--signal-glow)] text-[var(--signal)] scale-110'
                            : isGranted
                            ? 'border-[var(--signal-dim)] text-[var(--signal-dim)]'
                            : 'border-[var(--hairline)] text-[var(--ink-tertiary)] opacity-60'
                        }`}
                        animate={isThreat ? { rotate: [-2, 2, -2] } : isScanning ? { scale: [1, 1.1, 1] } : {}}
                        transition={isThreat ? { duration: 0.1, repeat: Infinity } : { duration: 0.3 }}
                      >
                        {isGranted ? '✓' : '✗'}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anomaly gauge */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-[8px] text-[var(--ink-tertiary)] w-20">ANOMALY DETECTOR</span>
        <div className="flex-grow h-2 bg-[var(--bg-void)] border border-[var(--hairline)] rounded-full overflow-hidden relative">
          {/* Danger zone marker */}
          <div className="absolute top-0 bottom-0 left-[75%] right-0 bg-[var(--warn)] opacity-20" />
          <motion.div
            className="h-full rounded-full transition-all duration-150"
            style={{
              width: `${anomalyScore * 100}%`,
              backgroundColor: anomalyScore > 0.75 ? 'var(--warn)' : anomalyScore > 0.4 ? 'var(--signal-dim)' : 'var(--signal)',
            }}
          />
        </div>
        <span className={`text-[9px] tabular-nums ${anomalyScore > 0.75 ? 'text-[var(--warn)]' : 'text-[var(--ink-secondary)]'}`}>
          {anomalyScore.toFixed(3)}
        </span>
      </div>
    </div>
  );
}
