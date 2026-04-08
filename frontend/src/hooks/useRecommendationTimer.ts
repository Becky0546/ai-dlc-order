import { useEffect, useRef, useState } from 'react';

export function useRecommendationTimer(delayMs = 60000) {
  const [shouldShow, setShouldShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setShouldShow(true);
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [delayMs]);

  const dismiss = () => setShouldShow(false);

  return { shouldShow, dismiss };
}
