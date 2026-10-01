"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";

const STORAGE_KEY = "gitcomm-theme";
const CHANGE_EVENT = "gitcomm-theme-change";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

function getSnapshot(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reduceMotion = useRef(false);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    reduceMotion.current = query.matches;
    const onChange = (event: MediaQueryListEvent) => {
      reduceMotion.current = event.matches;
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // The inline script in <head> owns the attribute before paint. React resets
  // <html> attributes on the Strict Mode dev remount, so restore it here.
  useLayoutEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const toggle = useCallback(() => {
    const next = getSnapshot() === "dark" ? "light" : "dark";

    const apply = () => {
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage blocked: the change still applies for this page view.
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    };

    // The browser crossfades the old and new snapshots, so the swap reads as a
    // dissolve rather than a hard cut. Not every engine ships the API.
    const startViewTransition = (document as ViewTransitionDocument)
      .startViewTransition;
    if (typeof startViewTransition === "function" && !reduceMotion.current) {
      startViewTransition.call(document, apply);
      return;
    }

    apply();
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
      className="cursor-pointer rounded-sm p-2 text-ink-muted transition-colors hover:bg-surface-strong hover:text-ink"
    >
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="size-4 fill-none stroke-current"
        strokeWidth="1.4"
      >
        {isDark ? (
          <>
            <circle cx="10" cy="10" r="3.6" />
            <path
              strokeLinecap="round"
              d="M10 2.4v1.8M10 15.8v1.8M17.6 10h-1.8M4.2 10H2.4M15.37 4.63l-1.27 1.27M5.9 14.1l-1.27 1.27M15.37 15.37l-1.27-1.27M5.9 5.9 4.63 4.63"
            />
          </>
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 11.7A6.9 6.9 0 0 1 8.3 3.5a6.9 6.9 0 1 0 8.2 8.2Z"
          />
        )}
      </svg>
    </button>
  );
}