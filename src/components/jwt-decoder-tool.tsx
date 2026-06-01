"use client";

import { useMemo, useState } from "react";

const starterInput = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlBhcnRoYSBTYXJhdGhpIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

type DecodedJWT = {
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
    signature: string;
};

export function JWTDecoderTool() {
    const [input, setInput] = useState(starterInput);
    const [decoded, setDecoded] = useState<DecodedJWT | null>(() => decodeJWT(starterInput));
    const [error, setError] = useState("");
    const [copiedHeader, setCopiedHeader] = useState(false);
    const [copiedPayload, setCopiedPayload] = useState(false);
    const [copiedAll, setCopiedAll] = useState(false);

    function decodeNow(text: string) {
        const cleaned = text.trim();
        if (!cleaned) {
            setDecoded(null);
            setError("");
            return;
        }

        try {
            const result = decodeJWT(cleaned);
            setDecoded(result);
            setError("");
        } catch (err: unknown) {
            setDecoded(null);
            const errorMessage = err instanceof Error ? err.message : "Failed to decode token. Ensure it's a valid JWT structure.";
            setError(errorMessage);
        }
    }

    function handleInputChange(text: string) {
        setInput(text);
        decodeNow(text);
        setCopiedHeader(false);
        setCopiedPayload(false);
        setCopiedAll(false);
    }

    async function copyToClipboard(text: string, setCopiedState: (v: boolean) => void) {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedState(true);
            window.setTimeout(() => setCopiedState(false), 1500);
        } catch {
            setError("Copy failed. Your browser may have blocked clipboard access.");
        }
    }

    function handleClear() {
        setInput("");
        setDecoded(null);
        setError("");
        setCopiedHeader(false);
        setCopiedPayload(false);
        setCopiedAll(false);
    }

    const metadata = useMemo(() => {
        if (!decoded || !decoded.payload) return null;

        const p = decoded.payload;
        const h = decoded.header;

        const formatTime = (timestamp?: unknown) => {
            if (typeof timestamp !== "number") return null;
            try {
                return new Date(timestamp * 1000).toLocaleString();
            } catch {
                return null;
            }
        };

        return {
            algorithm: (h.alg as string) || "None",
            type: (h.typ as string) || "JWT",
            issuer: (p.iss as string) || "None",
            subject: (p.sub as string) || "None",
            audience: p.aud ? (Array.isArray(p.aud) ? p.aud.join(", ") : String(p.aud)) : "None",
            issuedAt: formatTime(p.iat),
            expirationTime: formatTime(p.exp),
            notBefore: formatTime(p.nbf),
        };
    }, [decoded]);

    const headerString = decoded ? JSON.stringify(decoded.header, null, 2) : "";
    const payloadString = decoded ? JSON.stringify(decoded.payload, null, 2) : "";
    const allDecodedString = decoded ? JSON.stringify({ header: decoded.header, payload: decoded.payload }, null, 2) : "";

    return (
        <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                        JWT Decoder
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                        Decode and inspect JSON Web Tokens (JWT) in real-time.
                    </h2>
                </div>

                <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]" htmlFor="jwt-decoder-input">
                    JWT Token (encoded)
                </label>
                <textarea
                    id="jwt-decoder-input"
                    value={input}
                    onChange={(event) => handleInputChange(event.target.value)}
                    placeholder="Paste your JWT (header.payload.signature) here..."
                    className="mt-3 min-h-[16rem] w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/85 px-4 py-4 font-mono text-sm leading-7 text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--border-strong)]"
                    spellCheck={false}
                />

                <div className="mt-5 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => decodeNow(input)}
                        className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5"
                    >
                        Decode
                    </button>
                    {decoded && (
                        <button
                            type="button"
                            onClick={() => copyToClipboard(allDecodedString, setCopiedAll)}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
                        >
                            {copiedAll ? "Copied JSON" : "Copy Decoded JSON"}
                        </button>
                    )}
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

                {metadata && (
                    <div className="mt-6 flex-1 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/40 p-4 sm:p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                            Token Claims Metadata
                        </p>
                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                            <MetaItem label="Algorithm" value={metadata.algorithm} />
                            <MetaItem label="Token Type" value={metadata.type} />
                            <MetaItem label="Issuer (iss)" value={metadata.issuer} />
                            <MetaItem label="Subject (sub)" value={metadata.subject} />
                            <MetaItem label="Audience (aud)" value={metadata.audience} />
                            <MetaItem label="Expiration (exp)" value={metadata.expirationTime} highlight={true} />
                            <MetaItem label="Issued At (iat)" value={metadata.issuedAt} />
                            <MetaItem label="Not Before (nbf)" value={metadata.notBefore} />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-6">
                {/* Header Section */}
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                                Part 1: Header
                            </p>
                            <h3 className="mt-1 text-lg font-semibold tracking-tight text-[var(--foreground)]">
                                Token Metadata
                            </h3>
                        </div>
                        {decoded && (
                            <button
                                type="button"
                                onClick={() => copyToClipboard(headerString, setCopiedHeader)}
                                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                                {copiedHeader ? "Copied" : "Copy Header"}
                            </button>
                        )}
                    </div>
                    <pre className="mt-4 max-h-[12rem] overflow-y-auto whitespace-pre-wrap rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/80 p-4 font-mono text-xs leading-5 text-[var(--foreground)]">
                        <code>{headerString || "Header data will appear here."}</code>
                    </pre>
                </div>

                {/* Payload Section */}
                <div className="flex-1 rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                                Part 2: Payload
                            </p>
                            <h3 className="mt-1 text-lg font-semibold tracking-tight text-[var(--foreground)]">
                                Decoded Claims
                            </h3>
                        </div>
                        {decoded && (
                            <button
                                type="button"
                                onClick={() => copyToClipboard(payloadString, setCopiedPayload)}
                                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                                {copiedPayload ? "Copied" : "Copy Payload"}
                            </button>
                        )}
                    </div>
                    <pre className="mt-4 min-h-[16rem] overflow-y-auto whitespace-pre-wrap rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/80 p-4 font-mono text-xs leading-5 text-[var(--foreground)]">
                        <code>{payloadString || "Payload claims will appear here."}</code>
                    </pre>
                </div>
            </div>
        </section>
    );
}

function MetaItem({ label, value, highlight = false }: { label: string; value: string | null; highlight?: boolean }) {
    if (!value) return null;
    return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/50 p-2.5">
            <span className="block text-xs font-medium text-[var(--muted)]">{label}</span>
            <span className={`block mt-1 font-mono text-xs font-semibold truncate ${highlight ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`} title={value}>
                {value}
            </span>
        </div>
    );
}

function base64urlDecode(str: string) {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
        base64 += "=";
    }
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

function decodeJWT(token: string): DecodedJWT {
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
        throw new Error("JWT must contain exactly three dot-separated parts (header.payload.signature).");
    }

    const [headerB64, payloadB64, signature] = parts;

    try {
        const decodedHeader = JSON.parse(base64urlDecode(headerB64));
        const decodedPayload = JSON.parse(base64urlDecode(payloadB64));

        return {
            header: decodedHeader,
            payload: decodedPayload,
            signature,
        };
    } catch {
        throw new Error("Error decoding base64url content. Ensure the token is a valid JWT.");
    }
}
