import { useState, useEffect, useRef } from 'react';

export function useNumberCounter(value: number, duration: number = 1000, delay: number = 0) {
  const [displayValue, setDisplayValue] = useState(value);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(value);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === displayValue) return;

    // Reset animation state
    startTimeRef.current = null;
    startValueRef.current = displayValue;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function: easeOutQuart (smooth deceleration)
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      
      const nextValue = Math.round(startValueRef.current + (value - startValueRef.current) * easeOut);
      
      setDisplayValue(nextValue);

      if (percentage < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    let timeoutId: ReturnType<typeof setTimeout>;
    if (delay > 0) {
      timeoutId = setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(animate);
      }, delay);
    } else {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [value, duration, delay]); // We don't want displayValue as dependency here

  return displayValue;
}
