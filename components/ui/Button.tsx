"use client"

import Link from "next/link"
import { type ReactNode } from "react"

type Variant = "primary" | "secondary" | "outline-white" | "ai" | "ghost"
type Size = "sm" | "md" | "lg"

interface ButtonProps {
  children: ReactNode
  href?: string
  variant?: Variant
  size?: Size
  className?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  external?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  "outline-white": "btn btn-outline-white",
  ai: "btn btn-ai",
  ghost: "btn text-current hover:opacity-70",
}

const sizeClasses: Record<Size, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled,
  external,
}: ButtonProps) {
  const classes = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
