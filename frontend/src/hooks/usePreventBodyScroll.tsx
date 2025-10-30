import { useEffect } from 'react';

export function usePreventBodyScroll(lock: boolean) {
  useEffect(() => {
    const original = document.body.style.overflowY;

    if (lock) {
      document.body.style.overflowY = 'hidden';
    } else document.body.style.overflowY = original;

    // Cleanup to restore original value when unmounted
    return () => {
      document.body.style.overflowY = original;
    };
  }, [lock]);
}
