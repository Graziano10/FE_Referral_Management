import React, { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type CTAButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const base =
  "inline-flex items-center justify-center rounded font-heading transition " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-brand-lightest hover:bg-brand-medium focus-visible:ring-brand",
  secondary:
    "bg-brand-light text-brand-dark hover:bg-brand focus-visible:ring-brand-light",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-6 py-2 text-base",
  lg: "px-8 py-3 text-lg",
};

const CTA_Button = forwardRef<HTMLButtonElement, CTAButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      className,
      type = "button",
      ...props
    },
    ref
  ) => {
    const classes = [
      base,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? "w-full" : "",
      loading ? "pointer-events-none" : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-disabled={disabled || loading || undefined}
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {loading && (
          <span
            role="status"
            aria-live="polite"
            className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          />
        )}
        {leftIcon && !loading ? <span className="mr-2">{leftIcon}</span> : null}
        <span>{loading ? "Caricamento..." : children}</span>
        {rightIcon && !loading ? (
          <span className="ml-2">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

CTA_Button.displayName = "CTA_Button";
export default CTA_Button;
