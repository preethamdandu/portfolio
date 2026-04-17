import { projects } from '@/config/projects';
import DigitFlicker from '../motion/DigitFlicker';
import FinSignalHeatmap from './artifacts/FinSignalHeatmap';
import NeuroSearchTrace from './artifacts/NeuroSearchTrace';
import NexusMeshDiagram from './artifacts/NexusMeshDiagram';
import RaftSimulator from './artifacts/RaftSimulator';
import ROCCurve from './artifacts/ROCCurve';

const artifactComponents = {
  'finsignal': FinSignalHeatmap,
  'neurosearch': NeuroSearchTrace,
  'nexuslogistics': NexusMeshDiagram,
  'raft-pbft': RaftSimulator,
  'ksl-thesis': ROCCurve,
};

export default function CaseCard({ project, index, total }: { project: typeof projects[0], index: number, total: number }) {
  const Artifact = artifactComponents[project.slug as keyof typeof artifactComponents];

  return (
    <div className="w-full lg:w-[100vw] h-screen flex-shrink-0 flex items-center justify-center p-6 lg:p-24 relative overflow-hidden case-card">
      <div className="w-full max-w-[var(--content-max)] h-[70vh] lg:h-[60vh] flex flex-col lg:flex-row items-stretch border border-[var(--hairline)] bg-[var(--bg-elevated)]">
        
        {/* Left Side: Info */}
        <div className="w-full lg:w-5/12 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--hairline)]">
          <div>
            <div className="mono text-[var(--signal)] mb-8 tracking-widest">{project.id}</div>
            <h2 className="display-m mb-4">{project.title}</h2>
            <p className="body-l text-[var(--ink-secondary)] mb-8">{project.subtitle}</p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map(tag => (
                <span key={tag} className="border border-[var(--hairline-bold)] px-3 py-1 rounded bg-[var(--bg-void)] text-xs font-mono text-[var(--ink-secondary)] uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <p className="body text-[var(--ink-primary)] leading-relaxed italic border-l-2 border-[var(--signal)] pl-4 py-1">
              {project.description}
            </p>
          </div>
          
          <div className="mt-8 flex justify-between items-end border-t border-[var(--hairline-bold)] pt-4">
            <span className="mono text-[var(--ink-tertiary)]">{project.year}</span>
            <span className="mono text-[var(--ink-tertiary)]">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
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
