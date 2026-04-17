import { cn } from '@/lib/utils';
import LineReveal from '../motion/LineReveal';

export default function SectionIndex({ index, title, className }: { index: string, title: string, className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1 items-start text-[var(--ink-secondary)]", className)}>
      <LineReveal text={`${index} / ${title.toUpperCase()}`} className="mono-l tracking-widest uppercase opacity-70" />
    </div>
  );
}
