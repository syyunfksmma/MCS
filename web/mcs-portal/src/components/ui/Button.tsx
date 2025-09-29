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

export function Button({ variant = "primary", style, ...props }: ButtonProps) {
  const tokenColor =
    variant === "danger" ? designTokens.color.danger : designTokens.color.primary;
  return (
    <AntButton
      type={variantMap[variant]}
      style={{
        borderRadius: designTokens.radius.md,
        boxShadow: variant === "ghost" ? "none" : designTokens.elevation.level1,
        backgroundColor: variant === "ghost" ? designTokens.color.surface : tokenColor,
        color: variant === "ghost" ? designTokens.color.text : designTokens.color.surface,
        ...style
      }}
      {...props}
    />
  );
}
