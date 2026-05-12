"use client";

import React, { useEffect, useState } from 'react';

export default function Navbar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const intval = setInterval(updateTime, 1000);
    return () => clearInterval(intval);
  }, []);

  const handleScroll = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      // Lenis handles the scroll if it's active
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[500] p-6 lg:p-8 flex justify-between items-center bg-[var(--bg-void)]/80 backdrop-blur-md border-b border-[var(--hairline)] text-[var(--ink-primary)]">
      <div className="flex items-center gap-4 group cursor-pointer" data-magnetic onClick={(e) => handleScroll('hero', e)}>
        <div className="font-display font-medium text-xl tracking-tight relative">
          PD
          <div className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[var(--signal)] animate-pulse-signal"></div>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-8 font-mono text-sm tracking-[0.08em] uppercase">
        <a href="#work" onClick={(e) => handleScroll('work', e)} className="hover:text-[var(--signal)] transition-colors" data-magnetic>Work</a>
        <a href="#thesis" onClick={(e) => handleScroll('thesis', e)} className="hover:text-[var(--signal)] transition-colors" data-magnetic>Thesis</a>
        <a href="#contact" onClick={(e) => handleScroll('contact', e)} className="hover:text-[var(--signal)] transition-colors" data-magnetic>Contact</a>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:block font-mono text-xs tabular-nums tracking-widest opacity-60" suppressHydrationWarning>
          {time || '00:00:00'}
        </div>
        <div className="border border-[var(--hairline-bold)] rounded-full px-3 py-1 text-xs font-mono uppercase bg-[var(--bg-elevated)] bg-opacity-30 backdrop-blur-md flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse-signal" />
          <span className="opacity-80">Available</span>
        </div>
      </div>
    </nav>
  );
}
