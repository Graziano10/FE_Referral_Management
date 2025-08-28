// src/components/ui/LoadSpinner.tsx
import React from "react";
import { cn } from "./utils/cn";

export interface LoadSpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | "sm" | "md" | "lg"; // dimensioni in px o token
  color?: string; // tailwind class o css color
  label?: string; // per accessibilità
}

const sizeMap: Record<"sm" | "md" | "lg", number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

export const LoadSpinner: React.FC<LoadSpinnerProps> = ({
  size = "md",
  color = "currentColor",
  label = "Caricamento...",
  className,
  ...rest
}) => {
  const pixelSize = typeof size === "number" ? size : sizeMap[size];

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin", className)}
      role="status"
      aria-label={label}
      {...rest}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill={color}
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
};

export default LoadSpinner;
