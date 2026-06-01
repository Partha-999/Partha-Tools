"use client";

import { useMemo, useState } from "react";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/|~";

type StrengthTone = "weak" | "medium" | "strong";

function buildCharset(options: {
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
}) {
    let charset = "";

    if (options.includeUppercase) {
        charset += UPPERCASE;
    }
    if (options.includeLowercase) {
        charset += LOWERCASE;
    }
    if (options.includeNumbers) {
        charset += NUMBERS;
    }
    if (options.includeSymbols) {
        charset += SYMBOLS;
    }

    return charset;
}

function createPassword(length: number, charset: string) {
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);

    let nextPassword = "";
    for (let index = 0; index < values.length; index += 1) {
        const charIndex = values[index] % charset.length;
        nextPassword += charset[charIndex];
    }

    return nextPassword;
}

export function PasswordGeneratorTool() {
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(false);
    const [password, setPassword] = useState(() => {
        const initialCharset = buildCharset({
            includeUppercase: true,
            includeLowercase: true,
            includeNumbers: true,
            includeSymbols: false,
        });

        return createPassword(16, initialCharset);
    });
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const selectedGroupsCount = [includeUppercase, includeLowercase, includeNumbers, includeSymbols].filter(Boolean).length;

    const strength = useMemo(() => {
        const poolSize =
            (includeUppercase ? UPPERCASE.length : 0) +
            (includeLowercase ? LOWERCASE.length : 0) +
            (includeNumbers ? NUMBERS.length : 0) +
            (includeSymbols ? SYMBOLS.length : 0);

        const score = poolSize * length;

        if (score < 500 || selectedGroupsCount <= 1 || length < 10) {
            return { label: "Weak", tone: "weak" as StrengthTone };
        }

        if (score < 1200 || selectedGroupsCount === 2 || length < 14) {
            return { label: "Medium", tone: "medium" as StrengthTone };
        }

        return { label: "Strong", tone: "strong" as StrengthTone };
    }, [includeLowercase, includeNumbers, includeSymbols, includeUppercase, length, selectedGroupsCount]);

    function generatePassword() {
        const charset = buildCharset({
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSymbols,
        });

        if (!charset) {
            setPassword("");
            setError("Choose at least one character set to generate a password.");
            return;
        }

        const nextPassword = createPassword(length, charset);

        setPassword(nextPassword);
        setError("");
        setCopied(false);
    }

    async function copyPassword() {
        if (!password) {
            setError("Generate a password first.");
            return;
        }

        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
            setError("");
        } catch {
            setError("Copy failed. Your browser may have blocked clipboard access.");
        }
    }

    const strengthToneClass =
        strength.tone === "strong"
            ? "bg-emerald-500 text-white"
            : strength.tone === "medium"
                ? "bg-amber-500 text-white"
                : "bg-red-500 text-white";

    return (
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            Password Generator
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                            Generate secure passwords with custom character rules.
                        </h2>
                    </div>
                    <p className="text-sm text-[var(--muted)]">Length: {length}</p>
                </div>

                <div className="mt-6">
                    <label className="text-sm font-semibold text-[var(--foreground)]" htmlFor="password-length">
                        Password length slider (4-64)
                    </label>
                    <input
                        id="password-length"
                        type="range"
                        min={4}
                        max={64}
                        value={length}
                        onChange={(event) => setLength(Number(event.target.value))}
                        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[var(--accent-soft)]"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
                        <span>4</span>
                        <span>64</span>
                    </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <OptionToggle label="Include uppercase" checked={includeUppercase} onChange={setIncludeUppercase} />
                    <OptionToggle label="Include lowercase" checked={includeLowercase} onChange={setIncludeLowercase} />
                    <OptionToggle label="Include numbers" checked={includeNumbers} onChange={setIncludeNumbers} />
                    <OptionToggle label="Include symbols" checked={includeSymbols} onChange={setIncludeSymbols} />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={generatePassword}
                        className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5"
                    >
                        Generate
                    </button>
                    <button
                        type="button"
                        onClick={generatePassword}
                        className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
                    >
                        Regenerate
                    </button>
                    <button
                        type="button"
                        onClick={copyPassword}
                        className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
                    >
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>

                {error ? (
                    <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                        {error}
                    </div>
                ) : null}
            </div>

            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            Generated password
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                            Live output
                        </h3>
                    </div>
                    <span className={`rounded-full px-4 py-2 text-xs font-semibold ${strengthToneClass}`}>
                        {strength.label}
                    </span>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/80 p-5">
                    <p className="break-all font-mono text-base leading-8 text-[var(--foreground)]">
                        {password || "Select options and generate a password."}
                    </p>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <StatCard label="Length" value={String(length)} />
                    <StatCard label="Enabled sets" value={String(selectedGroupsCount)} />
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/60 p-4 text-sm leading-7 text-[var(--muted)]">
                    Tip: use at least three character groups and a length of 14+ for stronger passwords.
                </div>
            </div>
        </section>
    );
}

function OptionToggle({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
            <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4" />
            {label}
        </label>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <article className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-soft)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{value}</p>
        </article>
    );
}
