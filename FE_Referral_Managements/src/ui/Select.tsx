import React, { forwardRef, useId } from "react";
import { cn } from "./utils/cn";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  options?: SelectOption[]; // alternativa a children <option>
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      fullWidth = false,
      size = "md",
      leftIcon,
      rightIcon,
      options,
      className,
      id,
      children,
      ...rest
    },
    ref
  ) => {
    const internalId = useId();
    const selectId = id || internalId;

    const sizeCls =
      size === "sm"
        ? "h-9 text-sm"
        : size === "lg"
        ? "h-12 text-base"
        : "h-10 text-base";
    const paddingLeft = leftIcon ? "pl-10" : "pl-3";

    // icona di default se non ne passi una (chevron verso il basso)
    const defaultRightIcon = (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          d="M6 9l6 6 6-6"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

    return (
      <div className={cn(fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1 block text-sm font-medium text-neutral-800"
          >
            {label}
          </label>
        )}

        <div className={cn("relative", fullWidth && "w-full")}>
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
              {leftIcon}
            </span>
          )}

          <select
            id={selectId}
            ref={ref}
            className={cn(
              "block w-full appearance-none rounded-md border border-neutral-400 bg-white text-neutral-900 shadow-sm transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand",
              sizeCls,
              paddingLeft,
              rightIcon ?? defaultRightIcon ? "pr-10" : "pr-3",
              error && "border-rose-500 focus-visible:ring-rose-500",
              className
            )}
            aria-invalid={!!error || undefined}
            {...rest}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={String(opt.value)}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          {(rightIcon ?? defaultRightIcon) && (
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500">
              {rightIcon ?? defaultRightIcon}
            </span>
          )}
        </div>

        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-600">{helperText}</p>
        )}
        {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
