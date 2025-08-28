import React, { forwardRef } from "react";

/**
 * Varianti tipografiche del DS
 */
type Variant = "h1" | "h2" | "h3" | "p" | "span";

/**
 * Mappa variant -> tag di default
 */
const defaultTag: Record<Variant, keyof React.JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  p: "p",
  span: "span",
};

/**
 * Proprietà extra utili per i testi
 */
type ExtraTextProps = {
  as?: React.ElementType; // override del tag (polimorfico)
  align?: "left" | "center" | "right" | "justify";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  color?:
    | "brand-darkest"
    | "brand-dark"
    | "brand"
    | "brand-medium"
    | "brand-light"
    | "brand-lightest"
    | "black"
    | "white"
    | "inherit";
  leading?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  truncate?: boolean; // ellissi su una riga
  noWrap?: boolean; // no wrap
};

/**
 * Props polimorfici: HTML props del tag risolto + DS props
 */
export type TypographyProps<T extends React.ElementType = "p"> = {
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
} & ExtraTextProps &
  Omit<React.ComponentPropsWithoutRef<T>, "as" | "color">;

/**
 * Stili base per variant
 */
const variantClasses: Record<Variant, string> = {
  h1: "text-3xl font-bold",
  h2: "text-2xl font-semibold",
  h3: "text-xl font-medium",
  p: "text-base",
  span: "text-sm",
};

/**
 * Utilità -> className da props
 */
const colorMap: Record<NonNullable<ExtraTextProps["color"]>, string> = {
  "brand-darkest": "text-brand-darkest",
  "brand-dark": "text-brand-dark",
  brand: "text-brand",
  "brand-medium": "text-brand-medium",
  "brand-light": "text-brand-light",
  "brand-lightest": "text-brand-lightest",
  black: "text-black",
  white: "text-white",
  inherit: "text-inherit",
};
const alignMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
} as const;
const weightMap = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;
const leadingMap = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
} as const;

export const Typography = forwardRef(
  <T extends React.ElementType = "p">(
    {
      variant = "p",
      as,
      className = "",
      children,
      align,
      weight,
      color = "brand-medium",
      leading,
      truncate,
      noWrap,
      ...rest
    }: TypographyProps<T>,
    ref: React.Ref<Element>
  ) => {
    const Tag = (as ?? defaultTag[variant]) as React.ElementType;

    const classes = [
      variantClasses[variant],
      color && colorMap[color],
      align && alignMap[align],
      weight && weightMap[weight],
      leading && leadingMap[leading],
      truncate ? "truncate" : "",
      noWrap ? "whitespace-nowrap" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Tag ref={ref} className={classes} {...rest}>
        {children}
      </Tag>
    );
  }
);
Typography.displayName = "Typography";
