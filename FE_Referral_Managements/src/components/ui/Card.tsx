// src/components/ui/Card.tsx
import React, { forwardRef } from "react";
import { cn } from "./utils/cn";

export type CardVariant = "elevated" | "outline" | "ghost";

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: CardVariant;
  interactive?: boolean;
  header?: React.ReactNode;
  title?: React.ReactNode; // ora non confligge più
  subtitle?: React.ReactNode;
  media?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "elevated",
      interactive = false,
      header,
      title,
      subtitle,
      media,
      footer,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const variantCls =
      variant === "outline"
        ? "border border-neutral-200"
        : variant === "ghost"
        ? ""
        : "shadow-sm"; // elevated

    return (
      <div
        ref={ref}
        className={cn(
          "group overflow-hidden rounded-2xl bg-white text-neutral-900",
          variantCls,
          interactive &&
            "transition will-change-transform hover:shadow-lg hover:-translate-y-0.5",
          className
        )}
        {...rest}
      >
        {media && <div className="w-full">{media}</div>}

        {(header || title || subtitle) && (
          <div className="px-5 pt-5">
            {header}
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-600">{subtitle}</p>
            )}
          </div>
        )}

        <div className="px-5 py-4">{children}</div>

        {footer && (
          <div className="border-t border-neutral-200 px-5 py-4">{footer}</div>
        )}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
