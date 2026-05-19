import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

export function Card({ children, className, hover = true, padding = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-border rounded-xl shadow-card",
        hover && "transition-all duration-200 hover:shadow-card-hover hover:-translate-y-px",
        padding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
