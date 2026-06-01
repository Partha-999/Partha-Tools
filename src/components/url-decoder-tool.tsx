"use client";

import { useMemo, useState } from "react";

const starterInput = "https%3A%2F%2Fparthatools.com%2Fsearch%3Fquery%3Dreact%20%26%20nextjs%20%26%20category%3Ddeveloper%20tools";

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
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
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
                        <label className={`flex cursor-pointer flex-col rounded-2xl border p-4 transition-all ${mode === "component" ? "border-[var(--accent)] bg-[var(--accent-soft)]/20" : "border-[var(--border)] bg-[var(--background)]/50"}`}>
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="decoder-mode"
                                    checked={mode === "component"}
                                    onChange={() => handleModeChange("component")}
                                    className="h-4 w-4 text-[var(--accent)]"
                                />
                                <span className="text-sm font-semibold text-[var(--foreground)]">Decode Component</span>
                            </div>
                            <span className="mt-2 text-xs text-[var(--muted)]">Decodes all percent-encoded values. Recommended for query parameter values.</span>
                        </label>

                        <label className={`flex cursor-pointer flex-col rounded-2xl border p-4 transition-all ${mode === "uri" ? "border-[var(--accent)] bg-[var(--accent-soft)]/20" : "border-[var(--border)] bg-[var(--background)]/50"}`}>
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="decoder-mode"
                                    checked={mode === "uri"}
                                    onChange={() => handleModeChange("uri")}
                                    className="h-4 w-4 text-[var(--accent)]"
                                />
                                <span className="text-sm font-semibold text-[var(--foreground)]">Decode Full URI</span>
                            </div>
                            <span className="mt-2 text-xs text-[var(--muted)]">Decodes URL parameter encodings but skips structure-critical URI characters.</span>
                        </label>
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

                <div className="mt-5 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5"
                    >
                        {copied ? "Copied" : "Copy Decoded"}
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

            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
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

                <pre className="mt-5 min-h-[14rem] overflow-x-auto whitespace-pre-wrap rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/80 p-5 font-mono text-sm leading-7 text-[var(--foreground)]">
                    <code>{output || "Decoded text will appear here."}</code>
                </pre>

                <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/60 p-4 text-sm leading-7 text-[var(--muted)]">
                    Decodes UTF-8 percent-encoded string characters (including spaces, emojis, and symbols) to their original forms.
                </div>
            </div>
        </section>
    );
}
