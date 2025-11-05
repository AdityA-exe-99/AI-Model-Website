import { useEffect, useRef, useState } from 'react';
import { getMetrics, type MetricsResponse } from '@/lib/api';

export function useMetricsPolling(intervalMs: number = 20000, enabled: boolean = true) {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function tick() {
      try {
        setIsLoading(true);
        const m = await getMetrics();
        if (!cancelled) {
          setMetrics(m);
          setLastUpdated(new Date());
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error('Failed to fetch metrics'));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          const jitter = Math.round(Math.random() * 3000);
          timer.current = setTimeout(tick, intervalMs + jitter);
        }
      }
    }

    tick();

    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [intervalMs, enabled]);

  return { metrics, error, lastUpdated, isLoading };
}
