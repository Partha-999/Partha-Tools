"use client";

import { useMemo, useState } from "react";

const starterJson = `{
  "name": "ParthaTools",
  "features": ["validator", "formatter"],
  "published": true
}`;

type ValidationState =
    | { status: "idle"; message: string }
    | { status: "success"; message: string }
    | { status: "error"; message: string; line?: number; column?: number };

export function JsonValidatorTool() {
    const [input, setInput] = useState(starterJson);
    const [state, setState] = useState<ValidationState>({
        status: "idle",
        message: "Paste JSON and click Validate to check for syntax errors.",
    });
    const [copied, setCopied] = useState(false);

    const stats = useMemo(() => {
        const lineCount = input.length === 0 ? 0 : input.split("\n").length;

        return {
            characters: input.length,
            lines: lineCount,
        };
    }, [input]);

    function validateJson() {
        try {
            JSON.parse(input);
            setState({
                status: "success",
                message: "Valid JSON. The payload parsed successfully without syntax errors.",
            });
        } catch (error) {
            const parsedError = formatParseError(error, input);
            setState(parsedError);
        }
    }

    async function copyInput() {
        try {
            await navigator.clipboard.writeText(input);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setState({
                status: "error",
                message: "Copy failed. Your browser may have blocked clipboard access.",
            });
        }
    }

    function clearAll() {
        setInput("");
        setCopied(false);
        setState({
            status: "idle",
            message: "Paste JSON and click Validate to check for syntax errors.",
        });
    }

    const statusTone =
        state.status === "success"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
            : state.status === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200"
                : "border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted)]";

    return (
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            JSON Validator
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                            Validate JSON syntax with detailed parse feedback.
                        </h2>
                    </div>
                    <p className="text-sm text-[var(--muted)]">
                        {stats.lines} lines · {stats.characters} characters
                    </p>
                </div>

                <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]" htmlFor="json-validator-input">
                    JSON textarea input
                </label>
                <textarea
                    id="json-validator-input"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Paste JSON here..."
                    className="mt-3 min-h-[18rem] w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/85 px-4 py-4 font-mono text-sm leading-7 text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--border-strong)]"
                    spellCheck={false}
                />

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={validateJson}
                        className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5"
                    >
                        Validate
                    </button>
                    <button
                        type="button"
                        onClick={copyInput}
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
                            Validation result
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                            Syntax check status
                        </h3>
                    </div>
                    <div className={`rounded-full border px-4 py-2 text-xs font-semibold ${statusTone}`}>
                        {state.status === "success" ? "Valid JSON" : state.status === "error" ? "Invalid JSON" : "Waiting"}
                    </div>
                </div>

                <div className={`mt-5 rounded-[1.5rem] border px-5 py-4 text-sm leading-7 ${statusTone}`}>
                    {state.message}
                    {state.status === "error" && (state.line || state.column) ? (
                        <div className="mt-3 grid gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-current/80 sm:grid-cols-2">
                            {state.line ? <span>Line: {state.line}</span> : null}
                            {state.column ? <span>Column: {state.column}</span> : null}
                        </div>
                    ) : null}
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/70 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                        Parse details
                    </p>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                        <DetailRow label="Characters" value={String(stats.characters)} />
                        <DetailRow label="Lines" value={String(stats.lines)} />
                        <DetailRow label="Clipboard" value={copied ? "Copied" : "Ready"} />
                        <DetailRow
                            label="State"
                            value={state.status === "success" ? "Success" : state.status === "error" ? "Error" : "Idle"}
                        />
                    </dl>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/60 p-4 text-sm leading-7 text-[var(--muted)]">
                    Tip: validation checks syntax only. It does not alter your JSON, so you can paste API payloads directly.
                </div>
            </div>
        </section>
    );
}

function formatParseError(error: unknown, source: string): ValidationState {
    if (!(error instanceof SyntaxError)) {
        return {
            status: "error",
            message: "Invalid JSON. An unexpected parsing error occurred.",
        };
    }

    const details = extractLineColumn(error.message, source);

    return {
        status: "error",
        message: details.message,
        line: details.line,
        column: details.column,
    };
}

function extractLineColumn(message: string, source: string) {
    const positionMatch = message.match(/position\s+(\d+)/i);
    const position = positionMatch ? Number(positionMatch[1]) : undefined;

    if (typeof position !== "number" || Number.isNaN(position)) {
        return {
            message: `Invalid JSON. ${message}`,
            line: undefined,
            column: undefined,
        };
    }

    const beforeError = source.slice(0, position);
    const line = beforeError.split("\n").length;
    const lastLineBreak = beforeError.lastIndexOf("\n");
    const column = position - lastLineBreak;

    return {
        message: `Invalid JSON. ${message}`,
        line,
        column,
    };
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-soft)] backdrop-blur">
            <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">{label}</dt>
            <dd className="mt-2 text-sm font-semibold text-[var(--foreground)]">{value}</dd>
        </div>
    );
}
