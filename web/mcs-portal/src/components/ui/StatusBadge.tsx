"use client";

import { Tag } from "antd";

export type StatusTone = "success" | "processing" | "warning" | "error" | "default";

export interface StatusBadgeProps {
  tone?: StatusTone;
  text: string;
}

export function StatusBadge({ tone = "default", text }: StatusBadgeProps) {
  return <Tag color={tone} style={{ margin: 0 }}>{text}</Tag>;
}
