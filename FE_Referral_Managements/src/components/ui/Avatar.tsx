// src/components/ui/Avatar.tsx
import React, { useState } from "react";
import { Icon } from "./Icon"; // <-- verifica il path corretto (es: "../../ui/Icon")
import { cn } from "./utils/cn"; // <-- se non hai cn, vedi snippet in fondo

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string; // usato per le iniziali
  size?: AvatarSize;
  rounded?: "full" | "lg" | "md";
  alt?: string;
  status?: "online" | "offline" | "busy" | "none";
}

const AVATAR_SIZE_MAP: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
  xl: "h-16 w-16 text-base",
};

function avatarSizeClasses(size: AvatarSize) {
  return AVATAR_SIZE_MAP[size];
}

function initialsFromName(name?: string) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  rounded = "full",
  alt,
  status = "none",
  className,
  ...rest
}) => {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(src) && !errored;
  const initials = initialsFromName(name);

  const roundedCls =
    rounded === "full"
      ? "rounded-full"
      : rounded === "lg"
      ? "rounded-2xl"
      : "rounded-lg";

  return (
    <div
      className={cn(
        "relative inline-flex select-none items-center justify-center bg-neutral-200 text-neutral-700",
        roundedCls,
        avatarSizeClasses(size),
        className
      )}
      aria-label={alt || name}
      {...rest}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || name || "avatar"}
          className={cn("object-cover", roundedCls, "h-full w-full")}
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="font-semibold">
          {initials || <Icon name="user" />}
        </span>
      )}

      {status !== "none" && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white",
            status === "online" && "bg-green-500",
            status === "offline" && "bg-neutral-400",
            status === "busy" && "bg-rose-500"
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Avatar;
