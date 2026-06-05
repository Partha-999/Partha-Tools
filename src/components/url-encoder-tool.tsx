"use client";

import { useMemo, useState } from "react";

const starterInput = "https://parthatools.me/search?query=react & nextjs & category=developer tools";

export function URLEncoderTool() {
    const [input, setInput] = useState(starterInput);
    const [mode, setMode] = useState<"component" | "uri">("component");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const output = useMemo(() => {
        if (!input) return "";
        try {
            if (mode === "component") {
                return encodeURIComponent(input);
            } else {
                return encodeURI(input);
            }
        } catch {
            return "Encoding failed. Ensure the input string has correct character encoding.";
        }
    }, [input, mode]);

    const stats = useMemo(() => {
        return {
            inputChars: input.length,
            outputChars: output.length,
        };
    }, [input, output]);

    async function handleCopy() {
        if (!output) {
            setError("Nothing to copy yet.");
            return;
        }

        try {
            await navigator.clipboard.writeText(output);
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
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="min-w-0 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                                URL Encoder
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                                Encode text or URLs for safe transport over the web.
                            </h2>
                        </div>
                        <p className="text-sm text-[var(--muted)]">Input: {stats.inputChars} chars</p>
                    </div>

                    <div className="mt-6">
                        <label className="text-sm font-semibold text-[var(--foreground)]">
                            Encoding mode
                        </label>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setMode("component")}
                                className={`flex cursor-pointer flex-col text-left rounded-2xl border p-4 transition-all w-full min-h-[8rem] ${
                                    mode === "component"
                                        ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950 shadow-[var(--shadow-soft)]"
                                        : "border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] hover:border-[var(--border-strong)]"
                                }`}
                            >
                                <span className={`text-sm font-semibold ${
                                    mode === "component" ? "text-white dark:text-slate-950" : "text-[var(--foreground)]"
                                }`}>Encode Component</span>
                                <span className={`mt-2 text-xs ${
                                    mode === "component" ? "text-slate-300 dark:text-slate-600" : "text-[var(--muted)]"
                                }`}>Encodes all characters including /, ?, =, &, etc. Recommended for query parameters.</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMode("uri")}
                                className={`flex cursor-pointer flex-col text-left rounded-2xl border p-4 transition-all w-full min-h-[8rem] ${
                                    mode === "uri"
                                        ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950 shadow-[var(--shadow-soft)]"
                                        : "border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] hover:border-[var(--border-strong)]"
                                }`}
                            >
                                <span className={`text-sm font-semibold ${
                                    mode === "uri" ? "text-white dark:text-slate-950" : "text-[var(--foreground)]"
                                }`}>Encode Full URI</span>
                                <span className={`mt-2 text-xs ${
                                    mode === "uri" ? "text-slate-300 dark:text-slate-600" : "text-[var(--muted)]"
                                }`}>Preserves protocol and routing characters (http://, slashes, query delimiters).</span>
                            </button>
                        </div>
                    </div>

                    <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]" htmlFor="url-encoder-input">
                        Text to encode
                    </label>
                    <textarea
                        id="url-encoder-input"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Enter plain text or URL to encode..."
                        className="mt-3 min-h-[14rem] w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/85 px-4 py-4 font-mono text-sm leading-7 text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--border-strong)]"
                        spellCheck={false}
                    />

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex h-12 min-w-[9.5rem] items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5 cursor-pointer"
                        >
                            {copied ? "Copied" : "Copy Encoded"}
                        </button>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-transparent px-5 text-sm font-semibold text-[var(--muted)] transition-transform hover:-translate-y-0.5 hover:text-[var(--foreground)] cursor-pointer"
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

                <div className="min-w-0 rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                                Encoded Output
                            </p>
                            <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                                URL Safe String
                            </h3>
                        </div>
                        <div className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-semibold text-[var(--muted)]">
                            Output: {stats.outputChars} chars
                        </div>
                    </div>

                    <pre className="mt-5 min-h-[14rem] overflow-x-auto whitespace-pre-wrap break-all rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/80 p-5 font-mono text-sm leading-7 text-[var(--foreground)]">
                        <code>{output || "Encoded text will appear here."}</code>
                    </pre>

                    <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/60 p-4 text-sm leading-7 text-[var(--muted)]">
                        Characters like spaces, symbols, and non-ASCII glyphs are converted to percent-encoded equivalents.
                    </div>
                </div>
            </section>

            <hr className="border-[var(--border)]" />

            <article className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">What is URL Encoding?</h2>
                    <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                        URL encoding, often called percent-encoding, is a web standard used to convert non-ASCII characters and special reserved symbols in a Uniform Resource Identifier (URI) into a format that can be reliably transmitted over HTTP. It achieves this by mapping unsafe characters to their hexadecimal value prefixed by a percent sign (`%`).
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">How to use URL Encoder</h2>
                    <ol className="mt-2 list-decimal list-inside space-y-2 text-base leading-7 text-[var(--muted)]">
                        <li>Decide on your target mode: use <strong>Encode Component</strong> for key-value query parameters, or <strong>Encode Full URI</strong> if you want to keep the protocol (`https://`) and routing slashes intact.</li>
                        <li>Type, paste, or drag your text or raw URL into the input field.</li>
                        <li>The tool processes your input instantly and displays the percent-encoded version in the output panel.</li>
                        <li>Click <strong>Copy Encoded</strong> to load the resulting string directly into your clipboard.</li>
                    </ol>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Benefits of URL Encoder</h3>
                        <ul className="mt-2 list-disc list-inside space-y-2 text-sm leading-6 text-[var(--muted)]">
                            <li><strong>Prevents Parameter Breaking</strong>: Safely encodes spaces, ampersands (`&`), and question marks (`?`) so they are not mistaken for query key-value delimiters.</li>
                            <li><strong>UTF-8 Character Support</strong>: Handles complex unicode characters, emojis, and foreign alphabets, generating valid ASCII representations for safe request headers.</li>
                            <li><strong>Local Browser Sandbox</strong>: Runs completely offline in your browser&apos;s runtime. Your inputs are never stored, transmitted, or evaluated on any remote backend.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Frequently Asked Questions (FAQ)</h3>
                        <div className="mt-2 space-y-3 text-sm leading-6 text-[var(--muted)]">
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Why are spaces encoded as `%20` instead of `+`?</p>
                                <p>`%20` is the standard percent-encoding for a space character in URIs. The `+` sign is historically used to represent spaces in form submissions (`application/x-www-form-urlencoded`), but is less universal for general URLs.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">What happens to normal letters and numbers?</p>
                                <p>Standard alphanumeric characters (A-Z, a-z, 0-9) and certain unreserved marks like `-`, `_`, `.`, and `~` are left unaltered by both encoding modes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
