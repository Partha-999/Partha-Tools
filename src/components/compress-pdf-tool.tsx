"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface CompressedResult {
    originalSize: number;
    compressedSize: number;
    ratio: number;
    url: string;
    downloadName: string;
}

export function CompressPDFTool() {
    const [file, setFile] = useState<File | null>(null);
    const [pagesCount, setPagesCount] = useState<number | null>(null);
    const [compressionLevel, setCompressionLevel] = useState<"low" | "medium" | "high">("medium");
    const [isCompressing, setIsCompressing] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<CompressedResult | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setError("");
        setResult(null);
        const uploadedFile = acceptedFiles[0];

        if (!uploadedFile) return;

        if (uploadedFile.type !== "application/pdf" && !uploadedFile.name.endsWith(".pdf")) {
            setError("Only PDF files are supported.");
            return;
        }

        setFile(uploadedFile);

        try {
            const arrayBuffer = await uploadedFile.arrayBuffer();
            const { PDFDocument } = await import("pdf-lib");
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            setPagesCount(pdfDoc.getPageCount());
        } catch {
            setPagesCount(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
        },
        multiple: false,
    });

    const handleClear = () => {
        setFile(null);
        setPagesCount(null);
        setError("");
        if (result?.url) {
            URL.revokeObjectURL(result.url);
        }
        setResult(null);
    };

    const handleCompress = async () => {
        if (!file) return;

        setIsCompressing(true);
        setError("");
        setResult(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const { PDFDocument, PDFName } = await import("pdf-lib");

            let compressedPdfBytes: Uint8Array;

            if (compressionLevel === "low") {
                // Low compression: Save original document with object streams enabled
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });
            } else {
                // Medium or High: Copy pages to a new document (strips duplicate resources, structure metadata)
                const srcDoc = await PDFDocument.load(arrayBuffer);
                const destDoc = await PDFDocument.create();

                const copiedPages = await destDoc.copyPages(srcDoc, srcDoc.getPageIndices());

                copiedPages.forEach((page) => {
                    if (compressionLevel === "high") {
                        // High: Additionally strip all annotations (links, comments, form inputs)
                        try {
                            const annotsKey = PDFName.of("Annots");
                            if (page.node.has(annotsKey)) {
                                page.node.delete(annotsKey);
                            }
                        } catch {
                            // Non-blocking fallback
                        }
                    }
                    destDoc.addPage(page);
                });

                compressedPdfBytes = await destDoc.save({ useObjectStreams: true });
            }

            const compressedSize = compressedPdfBytes.length;
            const originalSize = file.size;

            // Determine if the compression actually reduced size.
            // If it didn't (e.g. file is already highly optimized), use the original file bytes
            // to ensure the user gets the absolute best size!
            let finalBytes = compressedPdfBytes;
            let finalSize = compressedSize;

            if (compressedSize >= originalSize) {
                finalBytes = new Uint8Array(arrayBuffer);
                finalSize = originalSize;
            }

            const blob = new Blob([finalBytes as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const ratio = originalSize > 0 
                ? Math.max(0, Math.round(((originalSize - finalSize) / originalSize) * 100))
                : 0;

            const nameParts = file.name.split(".");
            const ext = nameParts.pop();
            const downloadName = `${nameParts.join(".")}-compressed.${ext}`;

            setResult({
                originalSize,
                compressedSize: finalSize,
                ratio,
                url,
                downloadName,
            });
        } catch {
            setError("Failed to compress the PDF file. Please ensure it is not password-protected or corrupted.");
        } finally {
            setIsCompressing(false);
        }
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    return (
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left: Input Selection & File Info */}
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                        Compress PDF
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                        Reduce the file size of your PDF document.
                    </h2>
                </div>

                {!file ? (
                    /* Dropzone */
                    <div
                        {...getRootProps()}
                        className={`mt-6 flex min-h-[14rem] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed p-6 text-center transition-all ${
                            isDragActive
                                ? "border-[var(--accent)] bg-[var(--accent-soft)]/20"
                                : "border-[var(--border)] bg-[var(--background)]/50 hover:border-[var(--border-strong)]"
                        }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--accent-soft)] text-[var(--accent)]">
                            <UploadIcon />
                        </div>
                        <p className="mt-4 text-base font-semibold text-[var(--foreground)]">
                            {isDragActive ? "Drop PDF file here..." : "Drag & drop PDF file here, or click to browse"}
                        </p>
                        <p className="mt-1 text-xs text-[var(--muted)]">Supports PDF uploads. Processed entirely in browser.</p>
                    </div>
                ) : (
                    /* Selected File View */
                    <div className="mt-6 space-y-6">
                        <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-4">
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--accent)]">
                                    <PDFIcon />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-[var(--foreground)]" title={file.name}>
                                        {file.name}
                                    </p>
                                    <p className="mt-1 text-xs text-[var(--muted)]">
                                        {formatBytes(file.size)}
                                        {pagesCount !== null && ` • ${pagesCount} ${pagesCount === 1 ? "page" : "pages"}`}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Remove File"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Compression Level Selector */}
                        <div>
                            <label className="text-sm font-semibold text-[var(--foreground)]">
                                Compression Strength
                            </label>
                            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                                {/* Low */}
                                <button
                                    type="button"
                                    onClick={() => setCompressionLevel("low")}
                                    className={`flex flex-col text-left rounded-2xl border p-4 transition-all min-h-[7rem] cursor-pointer ${
                                        compressionLevel === "low"
                                            ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950 shadow-[var(--shadow-soft)]"
                                            : "border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] hover:border-[var(--border-strong)]"
                                    }`}
                                >
                                    <span className={`text-sm font-semibold ${
                                        compressionLevel === "low" ? "text-white dark:text-slate-950" : "text-[var(--foreground)]"
                                    }`}>Low</span>
                                    <span className={`mt-1 text-xs ${
                                        compressionLevel === "low" ? "text-slate-300 dark:text-slate-600" : "text-[var(--muted)]"
                                    }`}>Optimizes structure. Preserves all details.</span>
                                </button>

                                {/* Medium */}
                                <button
                                    type="button"
                                    onClick={() => setCompressionLevel("medium")}
                                    className={`flex flex-col text-left rounded-2xl border p-4 transition-all min-h-[7rem] cursor-pointer ${
                                        compressionLevel === "medium"
                                            ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950 shadow-[var(--shadow-soft)]"
                                            : "border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] hover:border-[var(--border-strong)]"
                                    }`}
                                >
                                    <span className={`text-sm font-semibold ${
                                        compressionLevel === "medium" ? "text-white dark:text-slate-950" : "text-[var(--foreground)]"
                                    }`}>Medium</span>
                                    <span className={`mt-1 text-xs ${
                                        compressionLevel === "medium" ? "text-slate-300 dark:text-slate-600" : "text-[var(--muted)]"
                                    }`}>Cleans unused data. Recommended.</span>
                                </button>

                                {/* High */}
                                <button
                                    type="button"
                                    onClick={() => setCompressionLevel("high")}
                                    className={`flex flex-col text-left rounded-2xl border p-4 transition-all min-h-[7rem] cursor-pointer ${
                                        compressionLevel === "high"
                                            ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950 shadow-[var(--shadow-soft)]"
                                            : "border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] hover:border-[var(--border-strong)]"
                                    }`}
                                >
                                    <span className={`text-sm font-semibold ${
                                        compressionLevel === "high" ? "text-white dark:text-slate-950" : "text-[var(--foreground)]"
                                    }`}>High</span>
                                    <span className={`mt-1 text-xs ${
                                        compressionLevel === "high" ? "text-slate-300 dark:text-slate-600" : "text-[var(--muted)]"
                                    }`}>Aggressive cleanup. Strips links & comments.</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Actions & Stats Summary */}
            <div className="flex flex-col gap-6">
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                        Compression Summary
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                        Optimization Details
                    </h3>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <StatCard label="Original Size" value={file ? formatBytes(file.size) : "-"} />
                        <StatCard label="Compressed Size" value={result ? formatBytes(result.compressedSize) : "-"} />
                        <StatCard 
                            label="Estimated Reduction" 
                            value={result ? `${result.ratio}%` : "-"} 
                            highlight={result !== null && result.ratio > 0}
                        />
                        <StatCard label="Level" value={file ? compressionLevel.toUpperCase() : "-"} />
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        {!result ? (
                            <button
                                type="button"
                                onClick={handleCompress}
                                disabled={isCompressing || !file}
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0"
                            >
                                {isCompressing ? (
                                    <span className="flex items-center gap-2">
                                        <SpinnerIcon /> Compressing...
                                    </span>
                                ) : (
                                    "Compress PDF"
                                )}
                            </button>
                        ) : (
                            <>
                                <a
                                    href={result.url}
                                    download={result.downloadName}
                                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5 text-center"
                                >
                                    Download Compressed PDF
                                </a>
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-transparent px-5 text-sm font-semibold text-[var(--muted)] transition-transform hover:-translate-y-0.5 hover:text-[var(--foreground)]"
                                >
                                    Clear All
                                </button>
                            </>
                        )}
                    </div>

                    {result && result.compressedSize >= result.originalSize && (
                        <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-xs text-[var(--muted)]">
                            Notice: This PDF is already highly optimized. We returned the smallest version of the file structure.
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                            {error}
                        </div>
                    )}
                </div>

                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                        Privacy First
                    </p>
                    <h4 className="mt-2 text-base font-semibold text-[var(--foreground)]">
                        Secure Client-Side Compression
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        Your files are parsed and optimized directly in your web browser. None of your document data is uploaded or transmitted to any server.
                    </p>
                </div>
            </div>
        </section>
    );
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-soft)]">
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                {label}
            </span>
            <span className={`mt-2 block text-2xl font-bold tracking-tight ${highlight ? "text-emerald-500" : "text-[var(--foreground)]"}`}>
                {value}
            </span>
        </div>
    );
}

function UploadIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
    );
}

function PDFIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M16 13H8M16 17H8" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

function SpinnerIcon() {
    return (
        <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}
