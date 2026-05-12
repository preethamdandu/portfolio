"use client";

import { useEffect, useState } from 'react';
import SectionIndex from '../ui/SectionIndex';
import ThesisRibbon from './ThesisRibbon';
import LineReveal from '../motion/LineReveal';
import ScrollReveal from '../motion/ScrollReveal';

export default function ThesisSection() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const fullQuote = "computational FHR research remains difficult to scale because researchers spend 70–80% of project time on data wrangling rather than scientific inquiry.";

  useEffect(() => {
    // Basic typewriter effect when in view
    // Using IntersectionObserver directly for simple triggering
    const elem = document.getElementById('thesis-quote-container');
    if (!elem) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let i = 0;
        const intval = setInterval(() => {
          setQuoteIdx(i);
          i++;
          if (i > fullQuote.length) clearInterval(intval);
        }, 15);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    
    observer.observe(elem);
    return () => observer.disconnect();
  }, [fullQuote.length]);

  return (
    <section id="thesis" className="relative w-full min-h-screen py-32 bg-[var(--bg-paper)] text-[var(--ink-inverse)] overflow-hidden transition-colors duration-1000">
      <ThesisRibbon />
      
      <div className="grid-container relative z-10">
        <div className="col-span-12 flex justify-between items-start mb-24">
          <SectionIndex index="04" title="Research" className="text-[var(--ink-inverse)] opacity-80" />
          <div className="mono text-right text-[var(--ink-inverse)] opacity-50">STONY BROOK UNIVERSITY · 2025</div>
        </div>

        {/* Pull Quote */}
        <div id="thesis-quote-container" className="col-span-12 xl:col-span-8 xl:col-start-3 mb-32 h-24">
          <p className="mono-l text-[var(--ink-inverse)] opacity-70 leading-relaxed before:content-['>_'] before:mr-2">
            {fullQuote.slice(0, quoteIdx)}
            <span className={quoteIdx < fullQuote.length ? "bg-[var(--ink-inverse)] text-[var(--bg-paper)] ml-1" : "hidden"}>&nbsp;</span>
          </p>
        </div>

        {/* Title */}
        <div className="col-span-12 xl:col-span-8 xl:col-start-3 mb-24 text-center">
          <h2 className="display-l mb-8 serif">
            "Foundational Infrastructure and Safety-Validated AI for Intrapartum Fetal Monitoring."
          </h2>
          <div className="w-12 h-px bg-[var(--ink-inverse)] mx-auto opacity-30 mb-8" />
          <p className="body-l opacity-80 max-w-2xl mx-auto">
            A three-tiered framework bridging research prototype to reproducible, interpretable clinical decision support. Advisor: Dr. Paul Fodor.
          </p>
        </div>

        {/* 3-Tier Grid */}
        <div className="col-span-12 flex flex-col md:flex-row gap-0 border border-[var(--ink-inverse)] border-opacity-20 bg-[var(--bg-paper)]">
          <ScrollReveal delay={0} className="flex-1 p-8 border-b md:border-b-0 md:border-r border-[var(--ink-inverse)] border-opacity-20 hover:bg-black/5 transition-colors">
            <h4 className="mono mb-8 opacity-60">INFRASTRUCTURE</h4>
            <div className="flex flex-col gap-2">
              <div className="serif text-3xl mb-4">4.2B samples</div>
              <div className="body opacity-80">20,000+ cases</div>
              <div className="body opacity-80">7 min cohort extraction</div>
              <div className="body opacity-60">(98% reduction)</div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.1} className="flex-1 p-8 border-b md:border-b-0 md:border-r border-[var(--ink-inverse)] border-opacity-20 hover:bg-black/5 transition-colors">
            <h4 className="mono mb-8 opacity-60">FEATURE FUSION</h4>
            <div className="flex flex-col gap-2">
              <div className="serif text-3xl mb-4">0.892 AUROC</div>
              <div className="body opacity-80">+4.7% over learned-only</div>
              <div className="body opacity-80">p = 0.023</div>
              <div className="body opacity-60">(DeLong test)</div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="flex-1 p-8 hover:bg-black/5 transition-colors">
            <h4 className="mono mb-8 opacity-60">LLM SAFETY</h4>
            <div className="flex flex-col gap-2">
              <div className="serif text-3xl mb-4">κ = 0.82</div>
              <div className="body opacity-80">FDA-grade rater agreement</div>
              <div className="body opacity-80">0% harmful recs</div>
              <div className="body opacity-60">eliminated by guardrails</div>
            </div>
          </ScrollReveal>
        </div>

        <div className="col-span-12 mt-24 flex flex-wrap gap-4 justify-center mono text-xs">
          <a href="/thesis" className="px-6 py-3 border border-[var(--ink-inverse)] border-opacity-20 bg-[var(--bg-paper)] hover:bg-[var(--ink-inverse)] hover:text-[var(--bg-paper)] transition-colors rounded-full flex items-center gap-2">
            READ THESIS <span className="text-xl leading-none">→</span>
          </a>
          <a href="#" className="px-6 py-3 border border-[var(--ink-inverse)] border-opacity-20 bg-[var(--bg-paper)] hover:bg-[var(--ink-inverse)] hover:text-[var(--bg-paper)] transition-colors rounded-full flex items-center gap-2">
            PROQUEST DOI <span className="text-xl leading-none">↗</span>
          </a>
          <a href="#" className="px-6 py-3 border border-[var(--ink-inverse)] border-opacity-20 bg-[var(--bg-paper)] hover:bg-[var(--ink-inverse)] hover:text-[var(--bg-paper)] transition-colors rounded-full flex items-center gap-2">
            GITHUB: PLATFORM <span className="text-xl leading-none">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
