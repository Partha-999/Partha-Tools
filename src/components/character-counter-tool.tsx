"use client";

import { useMemo, useState } from "react";

const starterInput = "Welcome to ParthaTools Character Counter! Check text limits for social media and SEO in real-time.";

type LimitPlatform = {
    name: string;
    limit: number;
    description: string;
};

const platforms: LimitPlatform[] = [
    { name: "Twitter Tweet", limit: 280, description: "Standard post length limit" },
    { name: "Google Title", limit: 60, description: "Recommended SEO search result title" },
    { name: "Google Meta", limit: 160, description: "Recommended SEO search description" },
    { name: "SMS Message", limit: 160, description: "Single SMS message page limit" },
    { name: "LinkedIn Post", limit: 3000, description: "Max character limit for regular post" },
];

export function CharacterCounterTool() {
    const [input, setInput] = useState(starterInput);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const stats = useMemo(() => {
        const text = input || "";
        const charCount = text.length;
        const charCountNoSpaces = text.replace(/\s/g, "").length;
        const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
        const lineCount = text.trim() === "" ? 0 : text.split(/\n/).length;

        const platformMetrics = platforms.map((p) => {
            const percentage = Math.min(100, Math.round((charCount / p.limit) * 100));
            const remaining = p.limit - charCount;
            const exceeded = remaining < 0;

            return {
                ...p,
                percentage,
                remaining,
                exceeded,
            };
        });

        return {
            charCount,
            charCountNoSpaces,
            wordCount,
            lineCount,
            platformMetrics,
        };
    }, [input]);

    async function handleCopy() {
        if (!input) {
            setError("Nothing to copy yet. Provide some text first.");
            return;
        }

        try {
            await navigator.clipboard.writeText(input);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
            setError("");
        } catch {
            setError("Copy failed. Your browser may have blocked clipboard access.");
        }
    }

    function handleClear() {
        setInput("");
        setError("");
        setCopied(false);
    }

    return (
        <div className="flex flex-col gap-10">
            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                                Character Counter
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                                Count characters, spaces, words, and verify social limits.
                            </h2>
                        </div>
                    </div>

                    <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]" htmlFor="char-counter-input">
                        Text input area
                    </label>
                    <textarea
                        id="char-counter-input"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Start typing your text here..."
                        className="mt-3 min-h-[22rem] w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/85 px-4 py-4 text-sm leading-7 text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--border-strong)]"
                        spellCheck={true}
                    />

                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5"
                        >
                            {copied ? "Copied text" : "Copy text"}
                        </button>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-transparent px-5 text-sm font-semibold text-[var(--muted)] transition-transform hover:-translate-y-0.5 hover:text-[var(--foreground)]"
                        >
                            Clear
                        </button>
                    </div>

                    {error ? (
                        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                            {error}
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-col gap-6">
                    <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            Core Stats
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                            Real-time Counts
                        </h3>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <MetricCard label="Characters" value={stats.charCount} />
                            <MetricCard label="Chars (no spaces)" value={stats.charCountNoSpaces} />
                            <MetricCard label="Words" value={stats.wordCount} />
                            <MetricCard label="Lines" value={stats.lineCount} />
                        </div>
                    </div>

                    <div className="flex-1 rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            Platform limits
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                            Limits & Remaining Characters
                        </h3>

                        <div className="mt-5 space-y-4">
                            {stats.platformMetrics.map((p) => {
                                const isExceeded = p.exceeded;
                                const progressColor = isExceeded
                                    ? "bg-red-500"
                                    : p.percentage > 90
                                        ? "bg-amber-500"
                                        : "bg-[var(--accent)]";

                                const remainingText = isExceeded
                                    ? `${Math.abs(p.remaining)} over limit`
                                    : `${p.remaining} remaining`;

                                return (
                                    <div key={p.name} className="flex flex-col gap-1 text-sm">
                                        <div className="flex items-center justify-between font-semibold">
                                            <div>
                                                <span className="text-[var(--foreground)]">{p.name}</span>
                                                <span className="ml-2 font-normal text-xs text-[var(--muted)]" title={p.description}>
                                                    ({p.limit})
                                                </span>
                                            </div>
                                            <span className={`font-mono text-xs ${isExceeded ? "text-red-500 font-bold" : "text-[var(--muted)]"}`}>
                                                {remainingText}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-[var(--background)] overflow-hidden">
                                            <div
                                                className={`h-full ${progressColor} transition-all duration-300`}
                                                style={{ width: `${p.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-[var(--border)]" />

            <article className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">What is a Character Counter?</h2>
                    <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                        A Character Counter is a specialized text metric utility designed to count letters, numerals, symbols, spaces, and line breaks in real time. Unlike standard word count tools, character counters help you inspect strict length restrictions required by email templates, database definitions, search engines, and social media platforms.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">How to use Character Counter</h2>
                    <ol className="mt-2 list-decimal list-inside space-y-2 text-base leading-7 text-[var(--muted)]">
                        <li>Type, dictate, or paste your target text block into the main editor window.</li>
                        <li>Examine the <strong>Real-time Counts</strong> container to view aggregate stats like lines, words, total characters, and character quantities excluding space buffers.</li>
                        <li>Inspect the **Platform Limits** meters to verify whether your text complies with maximum limits for Twitter posts, SMS payloads, LinkedIn updates, or search engine meta blocks.</li>
                        <li>Click <strong>Copy text</strong> to duplicate your processed text or <strong>Clear</strong> to purge the editor and start fresh.</li>
                    </ol>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Benefits of Character Counter</h3>
                        <ul className="mt-2 list-disc list-inside space-y-2 text-sm leading-6 text-[var(--muted)]">
                            <li><strong>SEO Maximization</strong>: Assists copywriters in designing Google Search titles under 60 characters and description tags under 160 characters to optimize visibility.</li>
                            <li><strong>Prevents Social Truncation</strong>: Highlights character overages on Twitter (X) or LinkedIn updates before you publish.</li>
                            <li><strong>Completely Private Execution</strong>: All string analyses run entirely in your local browser sandbox. Your paragraphs are never uploaded, parsed, or cached on any remote servers.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Frequently Asked Questions (FAQ)</h3>
                        <div className="mt-2 space-y-3 text-sm leading-6 text-[var(--muted)]">
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Why are spaces counted separately from characters?</p>
                                <p>Some publishing frameworks, SMS gateways, and database fields ignore or strip spaces when measuring size constraints, while others count every single whitespace. Displaying both metrics helps you adjust for both models.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">What is the standard character limit for SMS text messages?</p>
                                <p>Standard SMS messages are constrained to 160 characters. Exceeding this boundary causes cellular networks to split your text into multiple billing pages.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}

function MetricCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-soft)]">
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                {label}
            </span>
            <span className="mt-2 block text-2xl font-bold tracking-tight text-[var(--foreground)]">
                {value}
            </span>
        </div>
    );
}
