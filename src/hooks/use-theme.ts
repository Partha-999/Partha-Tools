"use client";

import { useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark";
const storageKey = "partha-tools-theme";

export function getThemeFromStorage(): ThemeMode {
    if (typeof window === "undefined") {
        return "light";
    }

    const storedTheme = window.localStorage.getItem(storageKey);
    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getThemeSnapshot(): ThemeMode {
    if (typeof document === "undefined") {
        return "light";
    }

    const currentTheme = document.documentElement.dataset.theme;
    if (currentTheme === "light" || currentTheme === "dark") {
        return currentTheme as ThemeMode;
    }

    return getThemeFromStorage();
}

export function subscribeToTheme(listener: () => void) {
    window.addEventListener("storage", listener);
    window.addEventListener("partha-themechange", listener as EventListener);

    return () => {
        window.removeEventListener("storage", listener);
        window.removeEventListener("partha-themechange", listener as EventListener);
    };
}

export function setTheme(nextTheme: ThemeMode) {
    if (typeof window === "undefined") {
        return;
    }

    const root = document.documentElement;
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    window.localStorage.setItem(storageKey, nextTheme);
    window.dispatchEvent(new Event("partha-themechange"));
}

export function useTheme() {
    return useSyncExternalStore<ThemeMode>(subscribeToTheme, getThemeSnapshot, () => "light");
}
