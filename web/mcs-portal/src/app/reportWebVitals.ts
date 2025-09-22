import type { NextWebVitalsMetric } from 'next/app';

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  if (typeof window === 'undefined') {
    return;
  }

  const payload = {
    ...metric,
    pathname: window.location.pathname,
    timestamp: Date.now()
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/web-vitals', body);
  } else {
    fetch('/api/web-vitals', {
      method: 'POST',
      body,
      keepalive: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(error => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[web-vitals] failed to report metric', error);
      }
    });
  }
}
