export default function HeroFallbackSVG() {
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none opacity-40 mix-blend-screen">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--hairline)" strokeWidth="1" />
          </pattern>
        </defs>
        
        {/* Isometric perspective grid */}
        <g transform="translate(50%, 40%) scale(1) rotate(45) skewX(20) skewY(20)">
          <rect x="-1000" y="-1000" width="2000" height="2000" fill="url(#grid)" />
          
          <circle cx="0" cy="0" r="100" fill="none" stroke="var(--hairline)" strokeWidth="1" />
          <circle cx="0" cy="0" r="200" fill="none" stroke="var(--hairline)" strokeWidth="1" />
          <circle cx="0" cy="0" r="300" fill="none" stroke="var(--hairline)" strokeWidth="1" />
          <circle cx="0" cy="0" r="400" fill="none" stroke="var(--signal)" strokeWidth="2" strokeDasharray="4 12" />
          <circle cx="0" cy="0" r="500" fill="none" stroke="var(--hairline)" strokeWidth="1" />
          <circle cx="0" cy="0" r="600" fill="none" stroke="var(--hairline)" strokeWidth="1" />
        </g>
      </svg>
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[var(--signal-glow)] rounded-full blur-[120px] opacity-20" />
    </div>
  );
}
