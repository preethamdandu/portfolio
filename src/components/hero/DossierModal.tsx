"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Placeholder content — swap these later ──
const PHOTO_URL = "/dossier-photo.jpg"; // Place your photo at public/dossier-photo.jpg
const PERSONAL_NOTE = "I build the systems that sit between the model and the patient, the API and the user, the data and the decision. My thesis validated clinical AI safety at FDA-grade agreement. My backends serve 19,200 RPS. I care less about the stack and more about whether it holds at 3am.";
const FACTS = [
  { key: "name", value: "Preetham Dandu" },
  { key: "origin", value: "India → New York" },
  { key: "degree", value: "M.S. CS, Stony Brook (4.0)" },
  { key: "thesis", value: "Safety-Validated AI for Clinical Monitoring" },
  { key: "currently", value: "Building AI infrastructure · Open to roles" },
  { key: "outside_cs", value: "football · hiking · building things for fun" },
];

export default function DossierModal({ isOpen, onClose }: DossierModalProps) {
  const [phase, setPhase] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [visibleFacts, setVisibleFacts] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // ── Holographic tilt ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // ── Phase sequencer ──
  useEffect(() => {
    if (!isOpen) {
      setPhase(0);
      setTypedText("");
      setVisibleFacts(0);
      typewriterStarted.current = false;
      factsStarted.current = false;
      return;
    }

    // Phase 1: scan line (immediate)
    setPhase(1);

    // Phase 2: wireframe card (300ms)
    const t2 = setTimeout(() => setPhase(2), 300);

    // Phase 3: photo develops (600ms)
    const t3 = setTimeout(() => setPhase(3), 700);

    // Phase 4: typewriter starts (1100ms)
    const t4 = setTimeout(() => setPhase(4), 1200);

    // Phase 5: facts cascade (after typewriter finishes)
    const t5 = setTimeout(() => setPhase(5), 1200 + PERSONAL_NOTE.length * 12 + 200);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isOpen]);

  // ── Typewriter effect — runs once when phase hits 4 ──
  const typewriterStarted = useRef(false);
  useEffect(() => {
    if (phase < 4 || typewriterStarted.current) return;
    typewriterStarted.current = true;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(PERSONAL_NOTE.slice(0, i));
      if (i >= PERSONAL_NOTE.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [phase]);

  // ── Facts cascade — runs once when phase hits 5 ──
  const factsStarted = useRef(false);
  useEffect(() => {
    if (phase < 5 || factsStarted.current) return;
    factsStarted.current = true;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleFacts(i);
      if (i >= FACTS.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [phase]);

  // ── ESC key close ──
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // ── Lock body scroll ──
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop blur */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            onClick={onClose}
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(16px)' }}
            exit={{ backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4 }}
          />

          {/* Scan line */}
          {phase >= 1 && phase < 3 && (
            <motion.div
              className="absolute left-0 right-0 h-px bg-[var(--signal)] z-[1001] pointer-events-none"
              initial={{ top: '0%', opacity: 0.8 }}
              animate={{ top: '100%', opacity: 0 }}
              transition={{ duration: 0.6, ease: 'linear' }}
              style={{ boxShadow: '0 0 20px var(--signal), 0 0 60px var(--signal)' }}
            />
          )}

          {/* Dossier Card */}
          {phase >= 2 && (
            <motion.div
              ref={cardRef}
              className="relative z-[1002] w-[90vw] max-w-[720px] mx-4"
              style={{ rotateX, rotateY, transformPerspective: 1200 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Wireframe border — always visible once phase 2 */}
              <div className="border border-[var(--hairline-bold)] bg-[var(--bg-elevated)]/95 backdrop-blur-md">
                
                {/* Header */}
                <motion.div 
                  className="border-b border-[var(--hairline)] px-8 py-5 flex justify-between items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--signal)] animate-pulse-signal" />
                    <span className="mono text-xs text-[var(--ink-secondary)] uppercase tracking-[0.15em]">Operator File</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="mono text-[10px] text-[var(--ink-tertiary)] hover:text-[var(--signal)] transition-colors tracking-widest cursor-pointer uppercase"
                    aria-label="Close dossier"
                  >
                    ✕ Close · ESC
                  </button>
                </motion.div>

                {/* Body */}
                <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-10">
                  
                  {/* Photo column */}
                  <div className="w-full md:w-[200px] flex-shrink-0">
                    <motion.div
                      className="relative aspect-[3/4] bg-[var(--bg-void)] border border-[var(--hairline)] overflow-hidden"
                      initial={{ opacity: 0, filter: 'blur(20px) brightness(0.3)' }}
                      animate={phase >= 3 ? { opacity: 1, filter: 'blur(0px) brightness(1)' } : {}}
                      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      {/* Duotone overlay */}
                      <div className="absolute inset-0 bg-[var(--signal)] mix-blend-color opacity-[0.06] z-10 pointer-events-none" />
                      
                      {/* Placeholder silhouette — replace with real photo */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img 
                          src={PHOTO_URL} 
                          alt="Preetham Dandu" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // If photo not found, show placeholder
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-[var(--bg-sunken)]">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--ink-tertiary)] opacity-30">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                              </div>
                            `;
                          }}
                        />
                      </div>

                      {/* Scan line on photo */}
                      {phase === 3 && (
                        <motion.div
                          className="absolute left-0 right-0 h-px bg-[var(--signal)] z-20"
                          initial={{ top: '0%' }}
                          animate={{ top: '100%' }}
                          transition={{ duration: 0.6, ease: 'linear' }}
                          style={{ boxShadow: '0 0 8px var(--signal)' }}
                        />
                      )}
                    </motion.div>
                  </div>

                  {/* Content column */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    
                    {/* Personal note — serif, italic, warm */}
                    <div className="mb-8">
                      <p className="serif text-[var(--ink-primary)] text-base md:text-lg leading-relaxed italic min-h-[80px]">
                        {phase >= 4 && (
                          <>
                            &ldquo;{typedText}
                            {typedText.length < PERSONAL_NOTE.length && (
                              <span className="inline-block w-[2px] h-[1em] bg-[var(--signal)] ml-0.5 animate-pulse align-text-bottom" />
                            )}
                            {typedText.length >= PERSONAL_NOTE.length && <>&rdquo;</>}
                          </>
                        )}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-[var(--hairline)] mb-6" />

                    {/* Key-value facts */}
                    <div className="flex flex-col gap-2 font-mono text-[13px]">
                      {FACTS.map((fact, i) => (
                        <motion.div
                          key={fact.key}
                          className="flex"
                          initial={{ opacity: 0, x: 10 }}
                          animate={i < visibleFacts ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                          <span className="w-28 md:w-32 text-[var(--ink-secondary)] flex-shrink-0">{fact.key}</span>
                          <span className="text-[var(--ink-tertiary)] mr-2">→</span>
                          <span className="text-[var(--ink-primary)]">{fact.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <motion.div
                  className="border-t border-[var(--hairline)] px-8 py-4 flex justify-between items-center"
                  initial={{ opacity: 0 }}
                  animate={phase >= 5 ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="mono text-[9px] text-[var(--ink-tertiary)] opacity-50 uppercase tracking-widest">
                    Clearance: Public · File #PD-2026
                  </span>
                  <div className="flex gap-4">
                    <a href="https://github.com/preethamdandu" target="_blank" rel="noreferrer" className="mono text-[10px] text-[var(--ink-secondary)] hover:text-[var(--signal)] transition-colors">
                      GitHub ↗
                    </a>
                    <a href="https://linkedin.com/in/preetham-dandu" target="_blank" rel="noreferrer" className="mono text-[10px] text-[var(--ink-secondary)] hover:text-[var(--signal)] transition-colors">
                      LinkedIn ↗
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
