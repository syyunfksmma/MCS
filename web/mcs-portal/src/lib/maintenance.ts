import maintenanceConfig from '@/config/maintenance.json';

type MaintenanceWindow = {
  start?: string;
  end?: string;
};

export interface MaintenanceConfig {
  active: boolean;
  window?: MaintenanceWindow;
  message?: string;
  contact?: string;
}

const config = maintenanceConfig as MaintenanceConfig;

const FORCE_MAINTENANCE = process.env.NEXT_PUBLIC_FORCE_MAINTENANCE === 'true';
const FORCE_WINDOW_START = process.env.NEXT_PUBLIC_FORCE_MAINTENANCE_START;
const FORCE_WINDOW_END = process.env.NEXT_PUBLIC_FORCE_MAINTENANCE_END;

function parseTime(value?: string): Date | undefined {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function getMaintenanceConfig(): MaintenanceConfig {
  return config;
}

export function isMaintenanceActive(now: Date = new Date()): boolean {
  if (FORCE_MAINTENANCE) {
    return true;
  }
  if (!config.active) {
    return false;
  }
  const start = parseTime(FORCE_WINDOW_START ?? config.window?.start);
  const end = parseTime(FORCE_WINDOW_END ?? config.window?.end);

  if (start && now < start) {
    return false;
  }
  if (end && now > end) {
    return false;
  }
  return true;
}

export function getMaintenanceWindowLabel(): string | undefined {
  const { window } = config;
  if (
    !window?.start &&
    !window?.end &&
    !FORCE_WINDOW_START &&
    !FORCE_WINDOW_END
  ) {
    return undefined;
  }
  const start = parseTime(FORCE_WINDOW_START ?? window?.start);
  const end = parseTime(FORCE_WINDOW_END ?? window?.end);

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  if (start && end) {
    return formatter.format(start) + ' → ' + formatter.format(end);
  }
  if (start) {
    return 'Starting ' + formatter.format(start);
  }
  if (end) {
    return 'Until ' + formatter.format(end);
  }
  return undefined;
}
