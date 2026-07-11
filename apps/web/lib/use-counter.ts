"use client";

import { useEffect, useState } from "react";

export function useCounter(target: number, active: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount(Math.round(target * Math.min(step / steps, 1)));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}
