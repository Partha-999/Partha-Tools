"use client";

import { useMemo, useState } from "react";

const starterInput = "UGFydGhhVG9vbHMg4piDIFVURi04IHRlc3Q6IOS9oOWlvSwg4KSo4KSu4KS44KWN4KSk4KWH";

export function Base64DecoderTool() {
    const [input, setInput] = useState(starterInput);
    const [output, setOutput] = useState(() => decodeBase64ToUtf8(starterInput));
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const stats = useMemo(() => {
        return {
            inputChars: input.length,
            outputChars: output.length,
        };
    }, [input, output]);

    function decodeNow(text: string) {
        const normalizedText = normalizeBase64(text);

        if (!normalizedText) {
            setOutput("");
            setError("");
            return;
        }

        try {
            const decoded = decodeBase64ToUtf8(normalizedText);
            setOutput(decoded);
            setError("");
        } catch {
            setOutput("");
            setError("Invalid Base64 input. Check padding and characters, then try again.");
        }
    }

    function handleInputChange(text: string) {
        setInput(text);
        decodeNow(text);
        setCopied(false);
    }

    function handleDecodeClick() {
        decodeNow(input);
    }

    async function handleCopy() {
        if (!output) {
            setError("Nothing to copy yet. Add valid Base64 input first.");
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
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                                Base64 Decoder
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                                Decode Base64 payloads into readable UTF-8 text.
                            </h2>
                        </div>
                        <p className="text-sm text-[var(--muted)]">Input: {stats.inputChars} chars</p>
                    </div>

                    <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]" htmlFor="base64-decoder-input">
                        Input textarea
                    </label>
                    <textarea
                        id="base64-decoder-input"
                        value={input}
                        onChange={(event) => handleInputChange(event.target.value)}
                        placeholder="Paste Base64 text to decode..."
                        className="mt-3 min-h-[18rem] w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/85 px-4 py-4 font-mono text-sm leading-7 text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--border-strong)]"
                        spellCheck={false}
                    />

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleDecodeClick}
                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5"
                        >
                            Decode
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
                                Decoded output
                            </p>
                            <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                                UTF-8 result
                            </h3>
                        </div>
                        <div className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-semibold text-[var(--muted)]">
                            Output: {stats.outputChars} chars
                        </div>
                    </div>

                    <pre className="mt-5 min-h-[18rem] overflow-x-auto whitespace-pre-wrap rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/80 p-5 text-sm leading-7 text-[var(--foreground)]">
                        <code>{output || "Decoded UTF-8 text will appear here."}</code>
                    </pre>

                    <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/60 p-4 text-sm leading-7 text-[var(--muted)]">
                        UTF-8 decoding is enabled, including multilingual text and emoji.
                    </div>
                </div>
            </section>

            <hr className="border-[var(--border)]" />

            <article className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">What is Base64 Decoding?</h2>
                    <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                        Base64 decoding extracts original binary sequences or plain text blocks out of ASCII-encoded Base64 string representations. Since many network transfer nodes treat control characters and special elements layout-safely under Base64, decoding restores the UTF-8 text and symbols for local parsing.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">How to Use Base64 Decoder</h2>
                    <ol className="mt-2 list-decimal list-inside space-y-2 text-base leading-7 text-[var(--muted)]">
                        <li>Paste your target Base64 encoded payload into the input text area.</li>
                        <li>The tool parses formatting characters and renders the decoded text automatically.</li>
                        <li>Click <strong>Decode</strong> to manually force execution if auto-parsing is not triggered.</li>
                        <li>Click <strong>Copy</strong> to capture the UTF-8 text result to your clipboard.</li>
                    </ol>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Benefits of Base64 Decoding</h3>
                        <ul className="mt-2 list-disc list-inside space-y-2 text-sm leading-6 text-[var(--muted)]">
                            <li><strong>Unicode Support</strong>: Recover complex symbols, non-English scripts, and emojis accurately through UTF-8 encoding support.</li>
                            <li><strong>Data Privacy</strong>: Safe isolated processing running 100% inside your current browser sandbox session.</li>
                            <li><strong>Error Alerts</strong>: Helps locate padding discrepancies or invalid characters with descriptive error dialogs.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Frequently Asked Questions (FAQ)</h3>
                        <div className="mt-2 space-y-3 text-sm leading-6 text-[var(--muted)]">
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">What triggers a decode error?</p>
                                <p>Errors generally occur when pasting string payloads containing non-Base64 characters (like <code>$</code>, <code>#</code>) or having invalid base-64 padding length.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Is padding necessary for decoding?</p>
                                <p>Standard specifications require equals (<code>=</code>) symbols at the end to align the character count. The tool handles padding configurations dynamically.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}

function normalizeBase64(value: string) {
    return value.replace(/\s+/g, "").trim();
}

function decodeBase64ToUtf8(value: string) {
    const normalized = normalizeBase64(value);

    if (!isLikelyBase64(normalized)) {
        throw new Error("Invalid base64 format");
    }

    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const decoder = new TextDecoder("utf-8", { fatal: true });
    return decoder.decode(bytes);
}

function isLikelyBase64(value: string) {
    if (!value) {
        return false;
    }

    return /^[A-Za-z0-9+/]*={0,2}$/.test(value) && value.length % 4 === 0;
}
