import { appInsights } from '@/lib/telemetry/client';

interface RoutingTelemetryEvent {
  name: string;
  properties?: Record<string, unknown>;
  measurements?: Record<string, number>;
}

export function logRoutingEvent({ name, properties, measurements }: RoutingTelemetryEvent) {
  if (!appInsights) {
    return;
  }
  appInsights.trackEvent({ name }, properties, measurements);
}
