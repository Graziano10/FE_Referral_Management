import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "./utils/cn";

type NavItem = {
  label: string;
  to: string;
  external?: boolean; // apre in nuova scheda
  end?: boolean; // forza "exact" solo dove serve
};

export type NavbarProps = {
  logo?: React.ReactNode;
  links?: NavItem[];
  actions?: React.ReactNode;
  className?: string;
  sticky?: boolean; // default true
  onLinkClick?: () => void; // chiusura menu su mobile
};

const Navbar: React.FC<NavbarProps> = ({
  logo,
  links = [],
  actions,
  className,
  sticky = true,
  onLinkClick,
}) => {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    if (!sticky) return;
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky]);

  const closeMenu = () => {
    setOpen(false);
    onLinkClick?.();
  };

  return (
    <nav
      className={cn(
        sticky && "sticky top-0 z-40",
        "w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md",
        scrolled && "shadow-sm",
        className
      )}
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            className="flex items-center gap-2 font-heading text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 rounded-md"
            onClick={closeMenu}
          >
            {logo ?? <span className="text-brand">Referral Dashboard</span>}
          </NavLink>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.to}
                href={l.to}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-sm font-medium transition rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 px-1",
                  "text-neutral-700 hover:text-brand"
                )}
              >
                {l.label}
              </a>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 px-1",
                    isActive
                      ? "text-brand"
                      : "text-neutral-700 hover:text-brand"
                  )
                }
                onClick={closeMenu}
              >
                {l.label}
              </NavLink>
            )
          )}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">{actions}</div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
          aria-controls="navbar-mobile"
        >
          <svg width="24" height="24" fill="currentColor" aria-hidden="true">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="navbar-mobile"
        className={cn(
          "md:hidden border-t border-neutral-200 bg-white/90 backdrop-blur-sm",
          open ? "block" : "hidden"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3">
            {links.map((l) =>
              l.external ? (
                <a
                  key={l.to}
                  href={l.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md px-2 py-2 text-sm font-medium text-neutral-700 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
                  onClick={closeMenu}
                >
                  {l.label}
                </a>
              ) : (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-2 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60",
                      isActive
                        ? "text-brand"
                        : "text-neutral-700 hover:text-brand"
                    )
                  }
                  onClick={closeMenu}
                >
                  {l.label}
                </NavLink>
              )
            )}
            {/* Actions in coda su mobile */}
            {actions && <div className="pt-2">{actions}</div>}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
