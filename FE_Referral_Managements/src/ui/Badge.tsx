// src/components/ui/Badge.tsx
import React, { forwardRef } from "react";
import { cn } from "./utils/cn"; // se non ce l’hai, vedi snippet in fondo

export type BadgeColor =
  | "brand"
  | "gray"
  | "success"
  | "warning"
  | "danger"
  | "info";
export type BadgeVariant = "solid" | "soft" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  variant?: BadgeVariant;
  size?: BadgeSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function badgeColorClasses(color: BadgeColor, variant: BadgeVariant) {
  const map: Record<BadgeColor, Record<BadgeVariant, string>> = {
    brand: {
      solid: "bg-brand text-brand-lightest",
      soft: "bg-brand-light text-brand-dark",
      outline: "text-brand border border-brand",
    },
    gray: {
      solid: "bg-neutral-800 text-white",
      soft: "bg-neutral-200 text-neutral-800",
      outline: "text-neutral-800 border border-neutral-400",
    },
    success: {
      solid: "bg-green-600 text-white",
      soft: "bg-green-100 text-green-800",
      outline: "text-green-700 border border-green-600",
    },
    warning: {
      solid: "bg-amber-600 text-white",
      soft: "bg-amber-100 text-amber-800",
      outline: "text-amber-700 border border-amber-600",
    },
    danger: {
      solid: "bg-rose-600 text-white",
      soft: "bg-rose-100 text-rose-800",
      outline: "text-rose-700 border border-rose-600",
    },
    info: {
      solid: "bg-sky-600 text-white",
      soft: "bg-sky-100 text-sky-800",
      outline: "text-sky-700 border border-sky-600",
    },
  };
  return map[color][variant];
}

function badgeSizeClasses(size: BadgeSize) {
  switch (size) {
    case "sm":
      return "text-xs px-2 py-0.5";
    case "lg":
      return "text-sm px-3 py-1";
    default:
      return "text-xs px-2.5 py-0.5"; // md
  }
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      color = "brand",
      variant = "soft",
      size = "md",
      leftIcon,
      rightIcon,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium",
          badgeColorClasses(color, variant),
          badgeSizeClasses(size),
          className
        )}
        {...rest}
      >
        {leftIcon ? (
          <span className="mr-1.5 -ml-0.5 flex items-center">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {rightIcon ? (
          <span className="ml-1.5 -mr-0.5 flex items-center">{rightIcon}</span>
        ) : null}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export default Badge;
