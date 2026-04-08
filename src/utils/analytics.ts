type EventParams = Record<string, string | number | boolean>;

export const trackEvent = (eventName: string, params: EventParams = {}) => {
  if (typeof window === 'undefined') return;

  const payload = {
    event: eventName,
    ...params,
    ts: Date.now(),
  };

  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
  };

  if (typeof w.gtag === 'function') {
    w.gtag('event', eventName, params);
  }

  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push(payload);
  }

  if (import.meta.env.DEV) {
    console.debug('[analytics]', payload);
  }
};
