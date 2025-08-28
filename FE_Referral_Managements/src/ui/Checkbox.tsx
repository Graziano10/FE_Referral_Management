// src/components/ui/Checkbox.tsx
import React, { forwardRef, useEffect, useId, useRef } from "react";
import type { MutableRefObject } from "react";
import { cn } from "./utils/cn"; // verifica il path in base al tuo progetto

type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  size?: CheckboxSize;
  indeterminate?: boolean;
  containerClassName?: string; // opzionale: class per il wrapper esterno
}

const SIZE_MAP: Record<CheckboxSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      className,
      containerClassName,
      size = "md",
      indeterminate = false,
      disabled,
      ...rest
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement | null>(null);

    // gestisci lo stato indeterminato a ogni cambio
    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const id = useId();

    return (
      <div
        className={cn(
          "flex items-start gap-3",
          disabled && "opacity-60 cursor-not-allowed",
          containerClassName
        )}
      >
        <div className="flex h-6 items-center">
          <input
            id={id}
            ref={(node) => {
              internalRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref)
                (ref as MutableRefObject<HTMLInputElement | null>).current =
                  node;
            }}
            type="checkbox"
            disabled={disabled}
            aria-invalid={!!error || undefined}
            className={cn(
              "peer rounded border border-neutral-400 bg-white text-brand ring-offset-2 transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              "checked:bg-brand checked:text-white checked:border-brand",
              SIZE_MAP[size],
              className
            )}
            {...rest}
          />
        </div>

        {(label || description || error) && (
          <div className="leading-tight">
            {label && (
              <label
                htmlFor={id}
                className="cursor-pointer select-none font-medium text-neutral-900"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-neutral-600">{description}</p>
            )}
            {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
