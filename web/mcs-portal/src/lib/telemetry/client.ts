interface AppInsightsLike {
  trackEvent: (
    event: { name: string },
    properties?: Record<string, unknown>,
    measurements?: Record<string, number>
  ) => void;
}

let instance: AppInsightsLike | null = null;

if (typeof window !== 'undefined') {
  instance = {
    trackEvent: (event, properties, measurements) => {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[telemetry]', event.name, { properties, measurements });
      }
    }
  };
}

export const appInsights = instance;
