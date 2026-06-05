"use client";

import { useMemo, useState } from "react";

type Mode = "format" | "minify";

const starterJson = `{
  "name": "ParthaTools",
  "type": "utility-suite",
  "features": [
    "formatter",
    "validator",
    "encoder"
  ],
  "status": {
    "live": true,
    "version": 1
  }
}`;

export function JsonFormatterTool() {
    const [input, setInput] = useState(starterJson);
    const [output, setOutput] = useState(starterJson);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const stats = useMemo(() => {
        const source = output || input;
        const lines = source.length === 0 ? 0 : source.split("\n").length;

        return {
            characters: source.length,
            lines,
        };
    }, [input, output]);

    function transformJson(mode: Mode) {
        try {
            const parsed = JSON.parse(input);
            const nextValue = mode === "format" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);

            setOutput(nextValue);
            setInput(nextValue);
            setError("");
        } catch {
            setError("Invalid JSON. Check commas, brackets, and quotes before trying again.");
        }
    }

    async function copyOutput() {
        const textToCopy = output || input;

        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setError("Copy failed. Your browser may have blocked clipboard access.");
        }
    }

    function clearAll() {
        setInput("");
        setOutput("");
        setError("");
        setCopied(false);
    }

    return (
        <div className="flex flex-col gap-10">
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                                JSON Formatter
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                                Format, minify, and copy JSON without leaving the page.
                            </h2>
                        </div>
                        <p className="text-sm text-[var(--muted)]">
                            {stats.lines} lines · {stats.characters} characters
                        </p>
                    </div>

                    <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]" htmlFor="json-input">
                        JSON input
                    </label>
                    <textarea
                        id="json-input"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Paste JSON here..."
                        className="mt-3 min-h-[18rem] w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/85 px-4 py-4 font-mono text-sm leading-7 text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--border-strong)]"
                        spellCheck={false}
                    />

                    {error ? (
                        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                            {error}
                        </div>
                    ) : null}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => transformJson("format")}
                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5"
                        >
                            Format
                        </button>
                        <button
                            type="button"
                            onClick={() => transformJson("minify")}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
                        >
                            Minify
                        </button>
                        <button
                            type="button"
                            onClick={copyOutput}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
                        >
                            {copied ? "Copied" : "Copy"}
                        </button>
                        <button
                            type="button"
                            onClick={clearAll}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-transparent px-5 text-sm font-semibold text-[var(--muted)] transition-transform hover:-translate-y-0.5 hover:text-[var(--foreground)]"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                                Output
                            </p>
                            <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                                Rendered JSON
                            </h3>
                        </div>
                        <div className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-semibold text-[var(--muted)]">
                            {copied ? "Copied to clipboard" : "Ready to copy"}
                        </div>
                    </div>

                    <pre className="mt-5 overflow-x-auto rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/80 p-5 text-sm leading-7 text-[var(--foreground)]">
                        <code>{output || "Your formatted JSON will appear here."}</code>
                    </pre>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <StatCard label="Characters" value={stats.characters} />
                        <StatCard label="Lines" value={stats.lines} />
                    </div>

                    <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/60 p-4 text-sm leading-7 text-[var(--muted)]">
                        Tip: use Format for readable indentation or Minify for compact transport-friendly JSON.
                    </div>
                </div>
            </section>

            <hr className="border-[var(--border)]" />

            <article className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">What is JSON Formatter?</h2>
                    <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                        JSON Formatter is a secure web-based tool designed to format, pretty-print, inspect, and minify JSON payloads directly in your browser. It helps software developers read nested configuration structures, analyze raw database outputs, and compact web payloads for efficient HTTP transfers.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">How to Use JSON Formatter</h2>
                    <ol className="mt-2 list-decimal list-inside space-y-2 text-base leading-7 text-[var(--muted)]">
                        <li>Paste your compact or unformatted JSON text into the input textarea field.</li>
                        <li>Click <strong>Format</strong> to expand the structure with double-space indentation, making it human-readable.</li>
                        <li>Click <strong>Minify</strong> if you wish to remove spacing, line breaks, and whitespace to compress the payload size.</li>
                        <li>Use the <strong>Copy</strong> button to capture the output, or <strong>Clear</strong> to start over.</li>
                    </ol>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Benefits of JSON Formatter</h3>
                        <ul className="mt-2 list-disc list-inside space-y-2 text-sm leading-6 text-[var(--muted)]">
                            <li><strong>Local Parsing</strong>: Your data is parsed using local JavaScript engine APIs, keeping your data confidential.</li>
                            <li><strong>Instant Feedback</strong>: Formatting and minification happen instantaneously without network requests.</li>
                            <li><strong>Real-time Metrics</strong>: Live monitoring counts the exact characters and lines in your payloads.</li>
                            <li><strong>Zero Dependencies</strong>: Pure client-side processing requiring no auth or telemetry.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Frequently Asked Questions (FAQ)</h3>
                        <div className="mt-2 space-y-3 text-sm leading-6 text-[var(--muted)]">
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Is my JSON data secure?</p>
                                <p>Yes. The formatting and minification are executed 100% locally in your browser memory. No data is sent to external servers.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">What happens if my JSON is invalid?</p>
                                <p>The tool will display a clear validation error message alerting you to syntax problems (e.g. trailing commas, missing brackets).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <article className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-soft)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{value}</p>
        </article>
    );
}
