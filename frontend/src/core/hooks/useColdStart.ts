'use client';

import { useState, useEffect } from 'react';

export function useColdStart(isLoading: boolean, threshold = 5000) {
  const [showBanner, setShowBanner] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (isLoading && !loadingStartTime) {
      setLoadingStartTime(Date.now());
      setShowBanner(false);
      setCountdown(60);
    } else if (!isLoading) {
      setLoadingStartTime(null);
      if (showBanner) {
        setTimeout(() => setShowBanner(false), 2000);
      }
    }
  }, [isLoading, loadingStartTime, showBanner]);

  useEffect(() => {
    if (!loadingStartTime || !isLoading) return;

    const timer = setTimeout(() => {
      const duration = Date.now() - loadingStartTime;
      if (duration > threshold) {
        setShowBanner(true);
      }
    }, threshold);

    return () => clearTimeout(timer);
  }, [loadingStartTime, isLoading, threshold]);

  useEffect(() => {
    if (!showBanner) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showBanner]);

  return { showBanner, countdown };
}