import React, { forwardRef, useId } from "react";
import { cn } from "./utils/cn";

export type InputSearchProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
};

const InputSearch = forwardRef<HTMLInputElement, InputSearchProps>(
  (
    { label, helperText, error, fullWidth, leftIcon, className, id, ...rest },
    ref
  ) => {
    const internalId = useId();
    const inputId = id ?? internalId;

    return (
      <div className={cn(fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
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
          <input
            id={inputId}
            ref={ref}
            type="search"
            className={cn(
              "w-full rounded-md border border-neutral-400 bg-white text-neutral-900 shadow-sm transition",
              "h-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand",
              leftIcon ? "pl-10" : "pl-3",
              "pr-3",
              error && "border-rose-500 focus-visible:ring-rose-500",
              className
            )}
            {...rest}
          />
        </div>
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-600">{helperText}</p>
        )}
        {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
      </div>
    );
  }
);

InputSearch.displayName = "InputSearch";
export default InputSearch;
