"use client";

import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";
import { designTokens } from "@/styles/tokens";

export type ButtonVariant = "primary" | "ghost" | "danger";

export interface ButtonProps extends AntButtonProps {
  variant?: ButtonVariant;
}

const variantMap: Record<ButtonVariant, AntButtonProps["type"]> = {
  primary: "primary",
  ghost: "default",
  danger: "primary"
};

const buttonPalette = {
  primary: designTokens.color.brandPrimary,
  danger: designTokens.status.rejected,
  surface: designTokens.color.surfaceElevated,
  text: designTokens.color.textPrimary
} as const;

export function Button({ variant = "primary", style, ...props }: ButtonProps) {
  const tokenColor =
    variant === "danger" ? buttonPalette.danger : buttonPalette.primary;

  return (
    <AntButton
      type={variantMap[variant]}
      style={{
        borderRadius: designTokens.radius.md,
        boxShadow: variant === "ghost" ? "none" : designTokens.elevation.level1,
        backgroundColor:
          variant === "ghost" ? buttonPalette.surface : tokenColor,
        color: variant === "ghost" ? buttonPalette.text : buttonPalette.surface,
        ...style
      }}
      {...props}
    />
  );
}
