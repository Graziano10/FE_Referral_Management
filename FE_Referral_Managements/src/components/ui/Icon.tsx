// src/components/ui/Icon.tsx
import React from "react";
import { cn } from "./utils/cn";

export type IconName =
  | "check"
  | "x"
  | "chevron-down"
  | "chevron-up"
  | "alert"
  | "info"
  | "user"
  | "dot"
  // nuovi:
  | "mail"
  | "phone"
  | "lock"
  | "eye"
  | "eye-off"
  | "building"
  | "map-pin"
  | "id-card";

const ICON_PATHS: Record<IconName, React.ReactNode> = {
  check: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  ),
  x: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  ),
  "chevron-down": (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
  ),
  "chevron-up": (
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l-6-6-6 6" />
  ),
  alert: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v4m0 4h.01M10.34 3.8l-8.4 14.4A2 2 0 0 0 3.2 21h17.6a2 2 0 0 0 1.72-2.8L14.11 3.8a2 2 0 0 0-3.77 0z"
    />
  ),
  info: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8h.01M11 12h2v6h-2z"
      />
      <circle cx="12" cy="12" r="10" fill="none" />
    </>
  ),
  user: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 21a8.25 8.25 0 1115 0v.75H4.5V21z"
      />
    </>
  ),
  dot: <circle cx="12" cy="12" r="5" />,
  // --- nuovi ---
  mail: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16v12H4zM4 7l8 6 8-6"
    />
  ),
  phone: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.6 10.8a12.5 12.5 0 006.6 6.6l2.2-2.2a1 1 0 011.1-.22 11 11 0 003.5.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h2.41a1 1 0 011 1 11 11 0 00.6 3.5 1 1 0 01-.22 1.1L6.6 10.8z"
    />
  ),
  lock: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 10V7a5 5 0 0110 0v3m-9 0h8a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6a2 2 0 012-2z"
    />
  ),
  eye: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zm11 3a3 3 0 100-6 3 3 0 000 6z"
    />
  ),
  "eye-off": (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M9.88 4.24A11.84 11.84 0 0112 5c7 0 11 7 11 7a21.7 21.7 0 01-4.15 4.95M6.24 6.24A21.7 21.7 0 001 12s4 7 11 7a11.84 11.84 0 005.76-1.52"
      />
    </>
  ),
  building: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 20h16M6 20V6a2 2 0 012-2h8a2 2 0 012 2v14M8 10h2m0 4H8m6-4h2m0 4h-2"
    />
  ),
  "map-pin": (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z"
      />
      <circle cx="12" cy="11" r="3" />
    </>
  ),
  "id-card": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h4M8 14h8" />
    </>
  ),
};

export type IconProps = React.SVGAttributes<SVGSVGElement> & {
  name?: IconName;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
};

export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  children,
  className,
  ...rest
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      className={cn("inline-block align-middle", className)}
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      {name ? ICON_PATHS[name] : children}
    </svg>
  );
}
