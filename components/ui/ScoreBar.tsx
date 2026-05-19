"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreBarProps {
  score: number;
  label?: string;
  className?: string;
  colorMode?: "saturation" | "trend";
  size?: "sm" | "md";
}

export function ScoreBar({ score, label, className, colorMode = "trend", size = "sm" }: ScoreBarProps) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(score), 100);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [score]);

  const color =
    colorMode === "saturation"
      ? score > 70 ? "#ef4444" : score > 40 ? "#f59e0b" : "#00ff87"
      : "#00ff87";

  const textColor =
    colorMode === "saturation"
      ? score > 70 ? "#ef4444" : score > 40 ? "#f59e0b" : "#00ff87"
      : "#00ff87";

  return (
    <div ref={ref} className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs text-[#52525b] truncate pr-2">{label}</span>
          <span className="font-mono text-xs font-semibold flex-shrink-0" style={{ color: textColor }}>
            {score}/100
          </span>
        </div>
      )}
      <div className="score-bar">
        <div
          className="score-bar-fill"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
}
