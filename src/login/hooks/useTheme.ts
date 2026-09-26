import {useEffect} from "react";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  useEffect(() => {
    if (systemTheme === "dark") {
      document.documentElement.classList.add("pf-v6-theme-dark");
      document.documentElement.classList.remove("pf-v6-theme-light");
    } else {
      document.documentElement.classList.add("pf-v6-theme-light");
      document.documentElement.classList.remove("pf-v6-theme-dark");
    }

    return () => {
      document.documentElement.classList.remove("pf-v6-theme-light", "pf-v6-theme-dark");
    };
  }, []);

  return systemTheme;
}
