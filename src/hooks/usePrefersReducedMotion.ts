import { useEffect, useState } from "react";

// True when the OS "reduce motion" setting is on; follows changes live.
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
