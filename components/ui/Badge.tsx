import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "muted";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-medium text-[0.65rem] px-2 py-0.5 rounded border whitespace-nowrap tracking-wide",
        {
          "bg-[#1a1a1a] text-[#71717a] border-[#2a2a2a]": variant === "default",
          "bg-primary/10 text-primary border-primary/25": variant === "primary" || variant === "success",
          "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/25": variant === "warning",
          "bg-danger/10 text-danger border-danger/25": variant === "danger",
          "bg-transparent text-[#52525b] border-[#1e1e1e]": variant === "muted",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
