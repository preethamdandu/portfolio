"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stepLogs = [
  "[00:00.00] initialize_agent(planner_model='Llama-3-70b-instruct')",
  "[00:00.12] receive_query: 'Analyze impact of recent Fed rate hike on TSLA.'",
  "[00:00.45] planner_action → decompose_query()",
  "[00:01.05] qdrant_vector_search(collection='macro_events', limit=5)",
  "[00:01.32] retriever_result → 5 docs found (similarity > 0.88)",
  "[00:01.50] qdrant_vector_search(collection='tsla_earnings', limit=3)",
  "[00:01.78] web_fetch(url='sec.gov/tsla/10-k') → 10,240 tokens",
  "[00:02.40] synthesize_context(tokens=12500)",
  "[00:04.15] llm_reasoning_step → chain_of_thought execution...",
  "[00:06.01] final_answer_generated → success."
];

export default function NeuroSearchTrace() {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [...prev, stepLogs[i]];
        if (next.length > 5) next.shift(); // keep only last 5
        return next;
      });
      i++;
      if (i >= stepLogs.length) {
        clearInterval(interval);
        setTimeout(() => {
          setLogs([]);
          i = 0;
          // Loop intentionally broken to prevent endless fast looping, let it run once or loop after delay
        }, 3000);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full p-8 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col items-center justify-center font-mono text-xs overflow-hidden relative">
      <div className="absolute top-4 left-4 flex gap-4">
        {['PLAN', 'FETCH', 'RERANK', 'SYNTH', 'ANSWER'].map((node, idx) => (
          <div key={node} className="flex gap-4 items-center">
            <div className={`px-2 py-1 border ${logs.length > idx * 2 ? 'border-[var(--signal)] text-[var(--signal)]' : 'border-[var(--hairline)] text-[var(--ink-secondary)]'} transition-colors duration-300`}>
              {node}
            </div>
            {idx < 4 && <div className={`w-8 h-[1px] ${logs.length > idx * 2 + 1 ? 'bg-[var(--signal)]' : 'bg-[var(--hairline)]'} transition-colors duration-300`} />}
          </div>
        ))}
      </div>

      <div className="w-full mt-16 max-w-lg bg-[var(--bg-elevated)] border border-[var(--hairline)] p-4 h-48 flex flex-col justify-end overflow-hidden">
        <AnimatePresence>
          {logs.map((log, idx) => (
            <motion.div 
              key={log + idx} // simple key
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-[var(--ink-secondary)] mb-2 whitespace-nowrap opacity-80"
            >
              {log.includes('final') ? <span className="text-[var(--signal)]">{log}</span> : log}
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="w-2 h-4 bg-[var(--signal)] animate-pulse inline-block mt-2"></div>
      </div>
    </div>
  );
}
