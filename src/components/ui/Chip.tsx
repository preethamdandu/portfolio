"use client";

import { Role } from '@/config/roles';

export default function Chip({ role }: { role: Role }) {
  return (
    <div 
      className="group flex items-center border border-[var(--hairline)] rounded-full px-4 py-1.5 cursor-pointer bg-[var(--bg-elevated)] bg-opacity-20 hover:bg-opacity-40 transition-smooth tabular-nums"
      style={{
        // We set a local CSS variable that hover states will use
        // The spec requires tinting the left border on hover, but we can do border-color for the whole chip or just left border
        // "role-tag tints appear ONLY as a 1px left border or dot on project cards — never as full fills"
        // Wait, for hero chip row: "On hover, each pill's left-border flashes to its tag tint"
      }}
    >
      <div 
        className="h-full w-[1px] mr-3 rounded-full transition-colors duration-180" 
        style={{ height: '12px', backgroundColor: 'var(--hairline-bold)' }}
      />
      <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--ink-secondary)] group-hover:text-white transition-colors duration-180">
        {role.label}
      </span>
      {/* 
        Tailwind doesn't easily support dynamic hover borders without JIT arbitrary values for colors which are computed. 
        So we do it via a custom inline style block for the specific component using the "role.tint" 
      */}
      <style jsx>{`
        .group:hover div {
          background-color: ${role.tint} !important;
        }
        .group:hover span {
          color: white; /* Or ${role.tint} if we wanted tinted text */
        }
        /* Make siblings dim when one is hovered */
        .flex:hover .group:not(:hover) {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
