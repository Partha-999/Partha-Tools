"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import QRCode from "qrcode";

const starterValue = "https://parthatools.me";

export function QrGeneratorTool() {
    const [value, setValue] = useState(starterValue);
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const stats = useMemo(() => {
        const trimmedValue = value.trim();

        return {
            characters: trimmedValue.length,
            words: trimmedValue.length === 0 ? 0 : trimmedValue.split(/\s+/).length,
        };
    }, [value]);

    useEffect(() => {
        let active = true;

        async function buildQr() {
            const trimmedValue = value.trim();

            if (trimmedValue.length === 0) {
                if (active) {
                    setQrDataUrl("");
                    setError("");
                }
                return;
            }

            try {
                const nextQrDataUrl = await QRCode.toDataURL(trimmedValue, {
                    errorCorrectionLevel: "M",
                    margin: 1,
                    width: 480,
                    color: {
                        dark: "#0f172a",
                        light: "#ffffff",
                    },
                });

                if (active) {
                    setQrDataUrl(nextQrDataUrl);
                    setError("");
                }
            } catch {
                if (active) {
                    setQrDataUrl("");
                    setError("Unable to generate the QR code. Try shortening the text or removing unsupported characters.");
                }
            }
        }

        void buildQr();

        return () => {
            active = false;
        };
    }, [value]);

    async function copyText() {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            setError("Copy failed. Your browser may have blocked clipboard access.");
        }
    }

    function clearValue() {
        setValue("");
        setQrDataUrl("");
        setError("");
        setCopied(false);
    }

    function downloadPng() {
        if (!qrDataUrl) {
            setError("Generate a QR code before downloading the PNG file.");
            return;
        }

        const fileName = "partha-tools-qr.png";
        const anchor = document.createElement("a");
        anchor.href = qrDataUrl;
        anchor.download = fileName;
        anchor.click();
    }

    const hasQr = qrDataUrl.length > 0;

    return (
        <div className="flex flex-col gap-10">
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                                QR Generator
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                                Turn text into a live QR code in real time.
                            </h2>
                        </div>
                        <p className="text-sm text-[var(--muted)]">
                            {stats.characters} characters · {stats.words} words
                        </p>
                    </div>

                    <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]" htmlFor="qr-input">
                        Input text field
                    </label>
                    <input
                        id="qr-input"
                        type="text"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="Enter text, a URL, or a message"
                        className="mt-3 h-14 w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/85 px-4 text-base text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--border-strong)]"
                    />

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={downloadPng}
                            disabled={!hasQr}
                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Download PNG
                        </button>
                        <button
                            type="button"
                            onClick={copyText}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
                        >
                            {copied ? "Copied" : "Copy text"}
                        </button>
                        <button
                            type="button"
                            onClick={clearValue}
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
                                Live preview
                            </p>
                            <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                                QR code output
                            </h3>
                        </div>
                        <div className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-semibold text-[var(--muted)]">
                            {hasQr ? "Ready" : "Waiting"}
                        </div>
                    </div>

                    <div className="mt-5 flex min-h-[22rem] items-center justify-center rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/80 p-5">
                        {hasQr ? (
                            <Image
                                src={qrDataUrl}
                                alt={`QR code for ${value}`}
                                width={480}
                                height={480}
                                unoptimized
                                className="h-auto w-full max-w-[18rem] rounded-3xl bg-white p-4 shadow-[var(--shadow-soft)]"
                            />
                        ) : (
                            <div className="max-w-sm text-center text-sm leading-7 text-[var(--muted)]">
                                Start typing to generate a QR code preview.
                            </div>
                        )}
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <StatCard label="Characters" value={stats.characters} />
                        <StatCard label="Words" value={stats.words} />
                    </div>

                    <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/60 p-4 text-sm leading-7 text-[var(--muted)]">
                        Tip: the preview updates live as you type, and Download PNG saves the current QR image instantly.
                    </div>
                </div>
            </section>

            <hr className="border-[var(--border)]" />

            <article className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">What is a QR Code Generator?</h2>
                    <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                        A QR Code Generator is a digital utility that translates character inputs (such as website links, phone numbers, contact cards, or raw text) into standard 2D Matrix barcodes. These visual code patterns can be easily scanned using smartphone cameras to access information instantly.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">How to Use QR Generator</h2>
                    <ol className="mt-2 list-decimal list-inside space-y-2 text-base leading-7 text-[var(--muted)]">
                        <li>Enter your destination link, phone details, or text payload into the input box.</li>
                        <li>The system automatically computes coordinates and renders the QR code live.</li>
                        <li>Click <strong>Download PNG</strong> to save the generated image onto your device.</li>
                        <li>Scan the image on your phone screen to verify that it loads the correct destination.</li>
                    </ol>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Benefits of QR Generator</h3>
                        <ul className="mt-2 list-disc list-inside space-y-2 text-sm leading-6 text-[var(--muted)]">
                            <li><strong>Offline Operation</strong>: Computes rendering layers client-side using JavaScript matrix libraries.</li>
                            <li><strong>Legible Resolution</strong>: Exports standard high-quality PNGs with optimal borders to guarantee reliable scanning.</li>
                            <li><strong>Dynamic Tuning</strong>: Updates instantly as you modify query parameters or content text.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Frequently Asked Questions (FAQ)</h3>
                        <div className="mt-2 space-y-3 text-sm leading-6 text-[var(--muted)]">
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Do my QR codes expire?</p>
                                <p>No. The generated codes are static matrix representations. They will remain functional indefinitely as long as your destination link remains active.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Can I change error correction settings?</p>
                                <p>Our generator utilizes Medium (M) error correction dynamically, which allows up to 15% image damage/obstruction while keeping the code fully scannable.</p>
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
