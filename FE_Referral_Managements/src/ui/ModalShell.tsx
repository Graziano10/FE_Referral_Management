// src/components/ui/ModalShell.tsx
import React, { useEffect, useId, useRef } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import { cn } from "./utils/cn";

export interface ModalShellProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode; // ora non confligge
  description?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlay?: boolean;
  initialFocusRef?: RefObject<HTMLElement>;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  overlayClassName?: string;
  container?: Element | null;
}

export function ModalShell({
  open,
  onClose,
  title,
  description,
  size = "md",
  closeOnOverlay = true,
  initialFocusRef,
  footer,
  showCloseButton = true,
  overlayClassName,
  className,
  children,
  container,
  ...rest
}: ModalShellProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus iniziale
    const toFocus = initialFocusRef?.current || dialogRef.current;
    toFocus?.focus();

    // ESC + trap focus
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables).filter(
          (el) => !el.hasAttribute("disabled")
        );
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open, onClose, initialFocusRef]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  } as const;

  const onOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current && closeOnOverlay) onClose();
  };

  const modal = (
    <div
      ref={overlayRef}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/50 backdrop-blur-sm",
        overlayClassName
      )}
      onMouseDown={onOverlayMouseDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        ref={dialogRef}
        className={cn(
          "w-full rounded-2xl bg-white text-neutral-900 shadow-2xl outline-none",
          "animate-in fade-in zoom-in-95",
          sizes[size],
          className
        )}
        {...rest}
      >
        {(title || description || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 px-5 pt-5">
            <div className="min-w-0">
              {title && (
                <h2 id={titleId} className="text-lg font-semibold">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="mt-1 text-sm text-neutral-600">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label="Chiudi modale"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="px-5 py-4">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-5 pb-5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Portal su body di default
  return createPortal(modal, container ?? document.body);
}

export default ModalShell;
