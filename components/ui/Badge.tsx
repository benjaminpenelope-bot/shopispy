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
        "inline-flex items-center font-sans font-medium text-[0.72rem] px-2.5 py-0.5 rounded-full whitespace-nowrap",
        {
          "bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]": variant === "default",
          "bg-[#eef2ff] text-primary border border-[#c7d2fe]": variant === "primary",
          "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]": variant === "success",
          "bg-[#fffbeb] text-[#d97706] border border-[#fde68a]": variant === "warning",
          "bg-[#fef2f2] text-danger border border-[#fecaca]": variant === "danger",
          "bg-transparent text-text-light border border-[#e5e7eb]": variant === "muted",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
