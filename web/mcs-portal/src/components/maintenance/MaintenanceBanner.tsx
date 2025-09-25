'use client';

import { Alert } from 'antd';
import { useMemo } from 'react';
import {
  getMaintenanceConfig,
  getMaintenanceWindowLabel,
  isMaintenanceActive
} from '@/lib/maintenance';

const UPCOMING_THRESHOLD_MS = 24 * 60 * 60 * 1000;

function isUpcoming(now: Date, start?: string): boolean {
  if (!start) {
    return false;
  }
  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) {
    return false;
  }
  const diff = startDate.getTime() - now.getTime();
  return diff > 0 && diff <= UPCOMING_THRESHOLD_MS;
}

export default function MaintenanceBanner() {
  const config = getMaintenanceConfig();
  const now = useMemo(() => new Date(), []);
  const active = isMaintenanceActive(now);
  const upcoming = isUpcoming(now, config.window?.start);

  if (!active && !upcoming) {
    return null;
  }

  const windowLabel = getMaintenanceWindowLabel();
  let label = active
    ? 'Maintenance mode is active'
    : 'Upcoming maintenance window';
  if (windowLabel) {
    label += ' · ' + windowLabel;
  }

  return (
    <Alert
      type={active ? 'warning' : 'info'}
      banner
      message={label}
      description={config.message}
      showIcon
    />
  );
}
