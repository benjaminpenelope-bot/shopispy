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
      ? score > 70 ? "#ef4444" : score > 40 ? "#f59e0b" : "#10b981"
      : "#4f46e5";

  const bgColor =
    colorMode === "saturation"
      ? score > 70 ? "#fef2f2" : score > 40 ? "#fffbeb" : "#ecfdf5"
      : "#eef2ff";

  const textColor =
    colorMode === "saturation"
      ? score > 70 ? "#ef4444" : score > 40 ? "#d97706" : "#059669"
      : "#4f46e5";

  return (
    <div ref={ref} className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="font-sans text-xs text-text-muted">{label}</span>
          <span
            className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{ color: textColor, background: bgColor }}
          >
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
