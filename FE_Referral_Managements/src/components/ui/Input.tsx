import React, { forwardRef, useId } from "react";

type Size = "sm" | "md" | "lg";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string; // messaggio errore
  hint?: string; // helper text
  size?: Size;
  fullWidth?: boolean;
  startIcon?: React.ReactNode; // icona a sinistra
  endIcon?: React.ReactNode; // icona a destra
  requiredAsterisk?: boolean; // mostra * se required
};

const sizeMap: Record<Size, { input: string; icon: string; label: string }> = {
  sm: { input: "h-9 text-sm px-3", icon: "w-4 h-4", label: "text-sm" },
  md: { input: "h-10 text-base px-4", icon: "w-5 h-5", label: "text-sm" },
  lg: { input: "h-12 text-lg px-5", icon: "w-6 h-6", label: "text-base" },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      size = "md",
      fullWidth,
      startIcon,
      endIcon,
      className = "",
      requiredAsterisk = true,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? `inp-${autoId}`;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    const hasError = Boolean(error);
    const s = size as Size; // 👈 narrow esplicito per indicizzare sizeMap

    const wrapperClasses = [
      "flex flex-col gap-1",
      fullWidth ? "w-full" : "w-auto",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const baseField =
      "block w-full rounded border transition focus:outline-none focus:ring-2";
    const stateField = hasError
      ? "border-red-500 focus:ring-red-500"
      : "border-brand-light focus:border-brand focus:ring-brand";

    const paddingLeft = startIcon ? "pl-10" : "";
    const paddingRight = endIcon ? "pr-10" : "";

    return (
      <div className={wrapperClasses}>
        {label && (
          <label
            htmlFor={inputId}
            className={`font-medium text-brand-dark ${sizeMap[s].label}`}
          >
            {label}
            {required && requiredAsterisk && (
              <span className="text-red-600">&nbsp;*</span>
            )}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <span
              className={`absolute left-3 top-1/2 -translate-y-1/2 text-brand-medium ${sizeMap[s].icon}`}
            >
              {startIcon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            required={required}
            aria-required={required ?? undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? errorId : hint ? hintId : undefined}
            className={[
              baseField,
              stateField,
              sizeMap[s].input,
              paddingLeft,
              paddingRight,
              "bg-white text-brand-darkest placeholder:text-brand-light",
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {endIcon && (
            <span
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-brand-medium ${sizeMap[s].icon}`}
            >
              {endIcon}
            </span>
          )}
        </div>

        {hint && !error && (
          <span id={hintId} className="text-xs text-brand-light">
            {hint}
          </span>
        )}
        {error && (
          <span id={errorId} className="text-xs text-red-600">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
