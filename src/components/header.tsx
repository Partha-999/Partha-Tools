"use client";

import Link from "next/link";
import { useTheme, setTheme } from "@/hooks/use-theme";

function SunIcon() {
    return <MiniIcon path="M12 3v3m0 12v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M3 12h3m12 0h3M4.2 19.8l2.1-2.1m11.4-11.4 2.1-2.1M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />;
}

function MoonIcon() {
    return <MiniIcon path="M18 13.5A7.5 7.5 0 0 1 10.5 6c0-.7.1-1.4.3-2A8 8 0 1 0 20 15.2c-.8-.5-1.6-1.1-2-1.7z" />;
}

function MiniIcon({ path }: { path: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d={path} />
        </svg>
    );
}

function ThemeToggle({
    theme,
    onToggle,
}: {
    theme: "light" | "dark";
    onToggle: (nextTheme: "light" | "dark") => void;
}) {
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={() => onToggle(isDark ? "light" : "dark")}
            className="inline-flex h-11 items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
            aria-label="Toggle color theme"
        >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--card)] text-[var(--accent)] shadow-[var(--shadow-soft)]">
                {isDark ? <MoonIcon /> : <SunIcon />}
            </span>
            <span className="hidden sm:inline">{isDark ? "Dark" : "Light"} mode</span>
        </button>
    );
}

export function Header() {
    const theme = useTheme();

    return (
        <header className="sticky top-4 z-20 rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)]/90 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:px-5">
            <div className="flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,94,239,0.3)]">
                        PT
                    </div>
                    <div>
                        <p className="text-sm font-semibold tracking-[0.24em] uppercase text-[var(--muted)]">
                            Partha Tools
                        </p>
                        <p className="text-xs text-[var(--muted)]">Utility tools, refined</p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
                    <Link href="/#categories" className="transition-colors hover:text-[var(--foreground)]">
                        Categories
                    </Link>
                    <Link href="/#popular-tools" className="transition-colors hover:text-[var(--foreground)]">
                        Tools
                    </Link>
                </nav>

                <ThemeToggle theme={theme} onToggle={setTheme} />
            </div>
        </header>
    );
}
