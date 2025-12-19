import { useEffect, useRef, useState } from "react";

export function useBoardSize() {
  const [breakpoint, setBreakpoint] = useState(6);
  const widthRef = useRef<number>(window.innerWidth);
  useEffect(() => {
    const updateBreakpoint = () => {
      widthRef.current = window.innerWidth;

      if (widthRef.current < 1180) {
        setBreakpoint(0);
      } else if (widthRef.current >= 1180 && widthRef.current < 1400) {
        setBreakpoint(2);
      } else if (widthRef.current >= 1400 && widthRef.current < 1536) {
        setBreakpoint(4);
      } else {
        setBreakpoint(6);
      }
    };

    updateBreakpoint();

    window.addEventListener("resize", updateBreakpoint);

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return { breakpoint, width: widthRef.current };
}
