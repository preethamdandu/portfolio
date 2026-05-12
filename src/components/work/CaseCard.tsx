import { projects } from '@/config/projects';
import DigitFlicker from '../motion/DigitFlicker';
import BEVGridViz from './artifacts/BEVGridViz';
import DocumentPipeline from './artifacts/DocumentPipeline';
import ROCCurve from './artifacts/ROCCurve';
import SecurityMatrix from './artifacts/SecurityMatrix';

import AgentOrchestrator from './artifacts/AgentOrchestrator';
import RadarChartViz from './artifacts/RadarChartViz';
import RaftSimulator from './artifacts/RaftSimulator';
import NeuroSearchTrace from './artifacts/NeuroSearchTrace';

const artifactComponents = {
  'bev-perception': BEVGridViz,
  'finsignal-nlp': DocumentPipeline,
  'ksl-thesis': ROCCurve,
  'finguard': SecurityMatrix,

  'unie-genie': AgentOrchestrator,
  'university-explorer': RadarChartViz,
  'raft-pbft': RaftSimulator,
  'neurosearch-agent': NeuroSearchTrace,
};

export default function CaseCard({ project, index, total }: { project: typeof projects[0], index: number, total: number }) {
  const Artifact = artifactComponents[project.slug as keyof typeof artifactComponents];

  return (
    <div className="w-full h-screen flex-shrink-0 flex items-center justify-center p-6 lg:p-24 relative overflow-hidden case-card">
      <div className="w-full max-w-[var(--content-max)] h-[75vh] lg:h-[70vh] flex flex-col lg:flex-row items-stretch border border-[var(--hairline)] bg-[var(--bg-elevated)]">
        
        {/* Left Side: Info */}
        <div className="w-full lg:w-5/12 flex flex-col border-b lg:border-b-0 lg:border-r border-[var(--hairline)] min-w-0">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-hidden p-8 lg:p-10 min-w-0 flex flex-col">
            <div className="mono text-[var(--signal)] mb-4 tracking-widest">{project.id}</div>
            <h2 className="display-m mb-2">{project.title}</h2>
            <p className="body-l text-[var(--ink-secondary)] mb-5">{project.subtitle}</p>
            
            <div className="flex flex-wrap gap-2 mb-5">
              {project.tags.map(tag => (
                <span key={tag} className="border border-[var(--hairline-bold)] px-3 py-1 rounded bg-[var(--bg-void)] text-xs font-mono text-[var(--ink-secondary)] uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <p className="body text-[var(--ink-primary)] leading-relaxed italic border-l-2 border-[var(--signal)] pl-4 py-1 line-clamp-4">
              {project.description}
            </p>
          </div>
          
          {/* Pinned footer — always visible */}
          <div className="flex-shrink-0 mx-8 lg:mx-10 flex justify-between items-center border-t border-[var(--hairline-bold)] py-4">
            <span className="mono text-[var(--ink-tertiary)]">{project.year}</span>
            <div className="flex items-center gap-4">
              {project.github && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="relative z-20 pointer-events-auto text-[var(--ink-tertiary)] hover:text-[var(--signal)] transition-colors p-2 -m-2" 
                  aria-label={`${project.title} GitHub`}
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <svg width="18" height="18" viewBox="0 0 98 96" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
                  </svg>
                </a>
              )}
              <span className="mono text-[var(--ink-tertiary)]">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Artifact & Metrics */}
        <div className="w-full lg:w-7/12 flex flex-col bg-[var(--bg-void)]">
          <div className="flex-grow p-4 lg:p-8 artifact-container relative">
            <div className="absolute inset-4 border border-[var(--hairline)] overflow-hidden">
               {Artifact && <Artifact />}
            </div>
          </div>
          <div className="h-20 lg:h-24 border-t border-[var(--hairline)] flex bg-[var(--bg-elevated)] divide-x divide-[var(--hairline)]">
            {project.metrics.map(metric => (
              <div key={metric} className="flex-1 flex flex-col items-center justify-center text-center p-2">
                <DigitFlicker value={metric.split(' ')[0]} className="text-[var(--signal)] text-sm lg:text-xl font-bold" />
                <span className="mono text-[8px] lg:text-[10px] text-[var(--ink-secondary)] mt-1">{metric.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
