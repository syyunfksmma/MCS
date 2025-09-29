"use client";

import { ReactNode, useEffect, useState } from "react";
import { Button, Space, Switch } from "antd";
import { isFeatureEnabled, setFeatureFlag, FeatureFlag } from "@/lib/featureFlags";

interface FeatureGateProps {
  flag: FeatureFlag;
  fallback?: ReactNode;
  children: ReactNode;
  onToggle?: (enabled: boolean) => void;
}

export default function FeatureGate({
  flag,
  fallback = null,
  children,
  onToggle
}: FeatureGateProps) {
  const [enabled, setEnabled] = useState(() => isFeatureEnabled(flag));

  const toggle = (checked: boolean) => {
    setFeatureFlag(flag, checked);
    setEnabled(checked);
  };

  useEffect(() => {
    onToggle?.(enabled);
  }, [enabled, onToggle]);

  return (
    <div className="flex flex-col gap-2">
      <Space align="center">
        <span className="text-sm text-gray-500">Feature: {flag}</span>
        <Switch checked={enabled} onChange={toggle} size="small" />
        <Button type="link" size="small" onClick={() => toggle(true)}>
          기본값 복원
        </Button>
      </Space>
      {enabled ? children : fallback}
    </div>
  );
}
