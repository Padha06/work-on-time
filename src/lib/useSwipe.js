import { useRef } from "react";

/**
 * Swipe gestures for touch carousels (responsive-design-patterns skill).
 * Returns touch handlers to spread onto a container: swipe left → onLeft
 * (usually "next"), swipe right → onRight ("previous"). Buttons/keyboard
 * remain the primary controls; swipe is progressive enhancement.
 */
export function useSwipe({ onLeft, onRight, minDistance = 50 } = {}) {
  const startX = useRef(0);
  const endX = useRef(0);

  return {
    onTouchStart: (e) => {
      endX.current = 0;
      startX.current = e.targetTouches[0]?.clientX || 0;
    },
    onTouchMove: (e) => {
      endX.current = e.targetTouches[0]?.clientX || 0;
    },
    onTouchEnd: () => {
      if (!startX.current || !endX.current) return;
      const d = startX.current - endX.current;
      if (d > minDistance && onLeft) onLeft();
      else if (d < -minDistance && onRight) onRight();
      startX.current = 0;
      endX.current = 0;
    },
  };
}
