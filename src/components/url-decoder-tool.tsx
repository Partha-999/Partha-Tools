"use client";

import { useMemo, useState } from "react";

const starterInput = "https%3A%2F%2Fparthatools.me%2Fsearch%3Fquery%3Dreact%20%26%20nextjs%20%26%20category%3Ddeveloper%20tools";

export function URLDecoderTool() {
    const [input, setInput] = useState(starterInput);
    const [mode, setMode] = useState<"component" | "uri">("component");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");
    const [output, setOutput] = useState(() => {
        try {
            return decodeURIComponent(starterInput);
        } catch {
            return "";
        }
    });

    function performDecode(text: string, currentMode: "component" | "uri") {
        if (!text) {
            setOutput("");
            setError("");
            return;
        }
        try {
            const decodedText = currentMode === "component"
                ? decodeURIComponent(text)
                : decodeURI(text);
            setOutput(decodedText);
            setError("");
        } catch {
            setOutput("");
            setError("Decoding failed. The input contains malformed percent-encoded sequences (e.g., % incomplete or invalid hex characters).");
        }
    }

    function handleInputChange(text: string) {
        setInput(text);
        performDecode(text, mode);
    }

    function handleModeChange(newMode: "component" | "uri") {
        setMode(newMode);
        performDecode(input, newMode);
    }

    const stats = useMemo(() => {
        return {
            inputChars: input.length,
            outputChars: output.length,
        };
    }, [input, output]);

    async function handleCopy() {
        if (!output) {
            setError("Nothing to copy yet. Provide a valid URL-encoded input first.");
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
        setOutput("");
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
                                URL Decoder
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                                Decode URL percent-encoded values back into plain text.
                            </h2>
                        </div>
                        <p className="text-sm text-[var(--muted)]">Input: {stats.inputChars} chars</p>
                    </div>

                    <div className="mt-6">
                        <label className="text-sm font-semibold text-[var(--foreground)]">
                            Decoding mode
                        </label>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => handleModeChange("component")}
                                className={`flex cursor-pointer flex-col text-left rounded-2xl border p-4 transition-all w-full min-h-[8rem] ${
                                    mode === "component"
                                        ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950 shadow-[var(--shadow-soft)]"
                                        : "border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] hover:border-[var(--border-strong)]"
                                }`}
                            >
                                <span className={`text-sm font-semibold ${
                                    mode === "component" ? "text-white dark:text-slate-950" : "text-[var(--foreground)]"
                                }`}>Decode Component</span>
                                <span className={`mt-2 text-xs ${
                                    mode === "component" ? "text-slate-300 dark:text-slate-600" : "text-[var(--muted)]"
                                }`}>Decodes all percent-encoded values. Recommended for query parameter values.</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleModeChange("uri")}
                                className={`flex cursor-pointer flex-col text-left rounded-2xl border p-4 transition-all w-full min-h-[8rem] ${
                                    mode === "uri"
                                        ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950 shadow-[var(--shadow-soft)]"
                                        : "border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] hover:border-[var(--border-strong)]"
                                }`}
                            >
                                <span className={`text-sm font-semibold ${
                                    mode === "uri" ? "text-white dark:text-slate-950" : "text-[var(--foreground)]"
                                }`}>Decode Full URI</span>
                                <span className={`mt-2 text-xs ${
                                    mode === "uri" ? "text-slate-300 dark:text-slate-600" : "text-[var(--muted)]"
                                }`}>Decodes URL parameter encodings but skips structure-critical URI characters.</span>
                            </button>
                        </div>
                    </div>

                    <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]" htmlFor="url-decoder-input">
                        Text to decode
                    </label>
                    <textarea
                        id="url-decoder-input"
                        value={input}
                        onChange={(event) => handleInputChange(event.target.value)}
                        placeholder="Enter URL-encoded text (with % percent symbols) here..."
                        className="mt-3 min-h-[14rem] w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/85 px-4 py-4 font-mono text-sm leading-7 text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--border-strong)]"
                        spellCheck={false}
                    />

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex h-12 min-w-[9.5rem] items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5 cursor-pointer"
                        >
                            {copied ? "Copied" : "Copy Decoded"}
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
                                Decoded Output
                            </p>
                            <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                                Plain Text result
                            </h3>
                        </div>
                        <div className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-semibold text-[var(--muted)]">
                            Output: {stats.outputChars} chars
                        </div>
                    </div>

                    <pre className="mt-5 min-h-[14rem] overflow-x-auto whitespace-pre-wrap break-all rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/80 p-5 font-mono text-sm leading-7 text-[var(--foreground)]">
                        <code>{output || "Decoded text will appear here."}</code>
                    </pre>

                    <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/60 p-4 text-sm leading-7 text-[var(--muted)]">
                        Decodes UTF-8 percent-encoded string characters (including spaces, emojis, and symbols) to their original forms.
                    </div>
                </div>
            </section>

            <hr className="border-[var(--border)]" />

            <article className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">What is URL Decoding?</h2>
                    <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                        URL decoding is the inverse operation of URL encoding. It converts a percent-encoded representation of characters back into its original UTF-8 layout. The decoding algorithm parses the target string, identifies every percent sign (`%`), reads the subsequent two hexadecimal characters, and reconstructs the corresponding byte array into human-readable text.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">How to use URL Decoder</h2>
                    <ol className="mt-2 list-decimal list-inside space-y-2 text-base leading-7 text-[var(--muted)]">
                        <li>Select your preferred mode: <strong>Decode Component</strong> is ideal for standard query strings, whereas <strong>Decode Full URI</strong> preserves main URL schemas.</li>
                        <li>Paste your encoded string (e.g., text featuring expressions like `%20`, `%3F`, or `%2F`) into the input area.</li>
                        <li>The application decodes the string instantly, populating the plain text output box in real time.</li>
                        <li>Click <strong>Copy Decoded</strong> to copy the decoded plain text directly.</li>
                    </ol>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Benefits of URL Decoder</h3>
                        <ul className="mt-2 list-disc list-inside space-y-2 text-sm leading-6 text-[var(--muted)]">
                            <li><strong>Readability Restoration</strong>: Easily translates cryptic percent-encoded URLs back into clear, human-readable paths.</li>
                            <li><strong>Multi-language Reconstruction</strong>: Restores encoded international scripts (like Cyrillic, Chinese characters, or Arabic) and complex emojis without data loss.</li>
                            <li><strong>Local and Secure</strong>: All calculations take place entirely inside your browser sandbox. None of your URL query contents are sent over the network or analyzed on a server.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Frequently Asked Questions (FAQ)</h3>
                        <div className="mt-2 space-y-3 text-sm leading-6 text-[var(--muted)]">
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Why do I see a &quot;Decoding failed&quot; error message?</p>
                                <p>This error is triggered when a `%` sign in your input is followed by characters that are not valid hexadecimal values, or if the percent symbol is at the very end of the text. In such cases, JavaScript&apos;s built-in decoding functions reject the input as malformed.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Does this tool decode Base64 data?</p>
                                <p>No. URL percent-decoding is distinct from Base64 encoding. To decode Base64 strings, please navigate to our dedicated Base64 Decoder utility page.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
