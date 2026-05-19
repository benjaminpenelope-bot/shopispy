"use client";
import { useEffect, useRef, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: number;
}

export function ScoreGauge({ score, label, size = 120 }: ScoreGaugeProps) {
  const [animated, setAnimated] = useState(0);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(score), 150);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [score]);

  const color =
    score >= 56 ? "#00ff87" :
    score >= 31 ? "#f59e0b" :
    "#ef4444";

  const glowColor =
    score >= 56 ? "rgba(0,255,135,0.4)" :
    score >= 31 ? "rgba(245,158,11,0.4)" :
    "rgba(239,68,68,0.4)";

  return (
    <div className="flex flex-col items-center gap-1.5" style={{ width: size }}>
      <svg
        ref={ref}
        viewBox="0 0 100 58"
        width={size}
        height={size * 0.58}
        fill="none"
      >
        {/* Track */}
        <path
          d="M 10 54 A 40 40 0 0 1 90 54"
          stroke="#1e1e1e"
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* Glow layer */}
        <path
          d="M 10 54 A 40 40 0 0 1 90 54"
          stroke={glowColor}
          strokeWidth="12"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${animated} 100`}
          style={{
            transition: "stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)",
            filter: "blur(4px)",
          }}
        />
        {/* Fill */}
        <path
          d="M 10 54 A 40 40 0 0 1 90 54"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${animated} 100`}
          style={{ transition: "stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)" }}
        />
        {/* Score */}
        <text
          x="50"
          y="45"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="22"
          fontWeight="800"
          fontFamily="var(--font-syne), sans-serif"
          fill={color}
        >
          {animated}
        </text>
        {/* /100 */}
        <text
          x="50"
          y="56"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8"
          fontFamily="var(--font-dm-mono), monospace"
          fill="#52525b"
          letterSpacing="1"
        >
          /100
        </text>
      </svg>
      {label && (
        <p className="font-mono text-[0.6rem] text-[#52525b] tracking-wider uppercase text-center leading-tight">
          {label}
        </p>
      )}
    </div>
  );
}
