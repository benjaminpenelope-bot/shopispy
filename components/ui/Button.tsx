"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-sans font-semibold rounded-lg transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none",
          "hover:-translate-y-px active:translate-y-0",
          {
            "bg-gradient-to-r from-primary to-secondary text-white shadow-glow-sm hover:shadow-glow hover:brightness-105":
              variant === "primary",
            "bg-bg-blue text-primary border border-[#c7d2fe] hover:bg-[#e0e7ff] hover:border-primary":
              variant === "secondary",
            "bg-white text-primary border-2 border-primary hover:bg-bg-blue":
              variant === "outline",
            "bg-transparent text-text-muted hover:text-ink hover:bg-bg-soft":
              variant === "ghost",
            "bg-danger text-white hover:bg-red-600":
              variant === "danger",
          },
          {
            "px-3 py-1.5 text-xs gap-1.5": size === "sm",
            "px-5 py-2.5 text-sm gap-2": size === "md",
            "px-7 py-3 text-base gap-2.5": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
