import {useEffect} from "react";

export type Style = "classic" | "glass" | "highContrast" | "system";

export function useStyle() {
  let systemStyle: Style;

  if (window.matchMedia("(prefers-contrast: more)").matches) {
    systemStyle = "highContrast";
  } else if (window.matchMedia("(prefers-reduced-transparency: reduce)").matches) {
    systemStyle = "classic";
  } else {
    systemStyle = "glass";
  }

  useEffect(() => {
    if (systemStyle === "classic") {
      document.documentElement.classList.remove("pf-v6-theme-glass", "pf-v6-theme-high-contrast");
    } else if (systemStyle === "highContrast") {
      document.documentElement.classList.add("pf-v6-theme-high-contrast");
      document.documentElement.classList.remove("pf-v6-theme-glass");
    } else {
      document.documentElement.classList.add("pf-v6-theme-glass");
      document.documentElement.classList.remove("pf-v6-theme-high-contrast");
    }

    return () => {
      document.documentElement.classList.remove("pf-v6-theme-glass", "pf-v6-theme-high-contrast");
    };
  }, []);

  return systemStyle;
}
