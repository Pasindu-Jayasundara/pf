import type { CSSProperties } from "react";

type AmbientParticlesProps = {
  count?: number;
  className?: string;
};

const shapes = ["pixel", "dash", "diamond", "cross"] as const;

const AmbientParticles = ({ count = 30, className = "" }: AmbientParticlesProps) => {
  const particles = Array.from({ length: count }, (_, index) => {
    const x = (index * 37 + 11) % 100;
    const y = (index * 53 + 17) % 100;
    const size = 6 + ((index * 7) % 16);
    const duration = 14 + ((index * 5) % 18);
    const delay = -((index * 3) % 16);
    const opacity = 0.18 + ((index * 11) % 20) / 100;
    const driftX = ((index % 2 === 0 ? 1 : -1) * (10 + ((index * 13) % 28)));
    const driftY = ((index % 3 === 0 ? -1 : 1) * (8 + ((index * 17) % 22)));
    const rotation = (index * 29) % 180;

    return {
      id: index,
      shape: shapes[index % shapes.length],
      style: {
        "--particle-x": `${x}%`,
        "--particle-y": `${y}%`,
        "--particle-size": `${size}px`,
        "--particle-duration": `${duration}s`,
        "--particle-delay": `${delay}s`,
        "--particle-opacity": opacity,
        "--particle-drift-x": `${driftX}px`,
        "--particle-drift-y": `${driftY}px`,
        "--particle-rotation": `${rotation}deg`,
      } as CSSProperties,
    };
  });

  return (
    <div aria-hidden="true" className={`ambient-particles ${className}`}>
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={`ambient-particle ambient-particle-${particle.shape}`}
          style={particle.style}
        />
      ))}
    </div>
  );
};

export default AmbientParticles;
