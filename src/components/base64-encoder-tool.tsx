"use client";

import { useMemo, useState } from "react";

const starterText = `ParthaTools\nUTF-8 test: 你好, नमस्ते, emoji 🚀`;

export function Base64EncoderTool() {
    const [input, setInput] = useState(starterText);
    const [output, setOutput] = useState(() => encodeUtf8ToBase64(starterText));
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const stats = useMemo(() => {
        return {
            inputChars: input.length,
            outputChars: output.length,
        };
    }, [input, output]);

    function encodeNow(text: string) {
        try {
            const nextOutput = encodeUtf8ToBase64(text);
            setOutput(nextOutput);
            setError("");
        } catch {
            setOutput("");
            setError("Encoding failed. Please check the input and try again.");
        }
    }

    function handleInputChange(text: string) {
        setInput(text);
        encodeNow(text);
        setCopied(false);
    }

    function handleEncodeClick() {
        encodeNow(input);
    }

    async function handleCopy() {
        if (!output) {
            setError("Nothing to copy yet. Add input text first.");
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
                            Base64 Encoder
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                            Convert plain UTF-8 text into Base64 instantly.
                        </h2>
                    </div>
                    <p className="text-sm text-[var(--muted)]">Input: {stats.inputChars} chars</p>
                </div>

                <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]" htmlFor="base64-input">
                    Input textarea
                </label>
                <textarea
                    id="base64-input"
                    value={input}
                    onChange={(event) => handleInputChange(event.target.value)}
                    placeholder="Type or paste text to encode..."
                    className="mt-3 min-h-[18rem] w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/85 px-4 py-4 font-mono text-sm leading-7 text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--border-strong)]"
                    spellCheck={false}
                />

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={handleEncodeClick}
                        className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5"
                    >
                        Encode
                    </button>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
                    >
                        {copied ? "Copied" : "Copy"}
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
                            Live output
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                            Base64 result
                        </h3>
                    </div>
                    <div className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-semibold text-[var(--muted)]">
                        Output: {stats.outputChars} chars
                    </div>
                </div>

                <pre className="mt-5 min-h-[18rem] overflow-x-auto rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/80 p-5 text-sm leading-7 text-[var(--foreground)]">
                    <code>{output || "Encoded Base64 will appear here as you type."}</code>
                </pre>

                <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/60 p-4 text-sm leading-7 text-[var(--muted)]">
                    UTF-8 support is enabled, so multi-language text and emoji are encoded correctly.
                </div>
            </div>
        </section>
    );
}

function encodeUtf8ToBase64(value: string) {
    const bytes = new TextEncoder().encode(value);

    let binary = "";
    const chunkSize = 0x8000;
    for (let index = 0; index < bytes.length; index += chunkSize) {
        const chunk = bytes.subarray(index, index + chunkSize);
        binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
}
