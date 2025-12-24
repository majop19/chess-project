import { useEffect, useState } from "react";

export function useBoardSize() {
  const [breakpoint, setBreakpoint] = useState(6);
  const [width, setWidth] = useState(window.innerWidth); // State pour déclencher un re-render
  useEffect(() => {
    const updateBreakpoint = () => {
      const currentWidth = window.innerWidth;
      console.log("currentWidth", currentWidth);
      setWidth(currentWidth); // Met à jour `width` ici

      if (currentWidth < 1180) {
        setBreakpoint(0);
      } else if (currentWidth >= 1180 && currentWidth < 1400) {
        setBreakpoint(2);
      } else if (currentWidth >= 1400 && currentWidth < 1536) {
        setBreakpoint(4);
      } else {
        setBreakpoint(6);
      }
    };
    window.addEventListener("resize", updateBreakpoint); // Écoute les changements de taille

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return { breakpoint, width };
}
