"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

export function SplitPDFTool() {
    const [file, setFile] = useState<File | null>(null);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [splitMode, setSplitMode] = useState<"range" | "custom">("range");
    
    // Range inputs
    const [startPage, setStartPage] = useState("1");
    const [endPage, setEndPage] = useState("1");

    // Custom selection input
    const [customSelection, setCustomSelection] = useState("1");

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setError("");
        setSuccess("");
        setTotalPages(null);

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
            const count = pdfDoc.getPageCount();
            setTotalPages(count);
            setEndPage(count.toString());
            setCustomSelection(`1-${count}`);
        } catch {
            setError("Failed to parse PDF file. Please ensure it is not password-protected or corrupted.");
            setFile(null);
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
        setTotalPages(null);
        setError("");
        setSuccess("");
        setStartPage("1");
        setEndPage("1");
        setCustomSelection("1");
    };

    // Parse freeform page strings to sorted 0-indexed integer list
    const parsePageRanges = (input: string, maxPages: number): number[] => {
        const pages = new Set<number>();
        const parts = input.split(",");
        
        for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;
            
            if (trimmed.includes("-")) {
                const [startStr, endStr] = trimmed.split("-");
                const start = parseInt(startStr.trim(), 10);
                const end = parseInt(endStr.trim(), 10);
                
                if (!isNaN(start) && !isNaN(end)) {
                    const from = Math.max(1, Math.min(start, end));
                    const to = Math.min(maxPages, Math.max(start, end));
                    for (let i = from; i <= to; i++) {
                        pages.add(i - 1);
                    }
                }
            } else {
                const p = parseInt(trimmed, 10);
                if (!isNaN(p) && p >= 1 && p <= maxPages) {
                    pages.add(p - 1);
                }
            }
        }
        
        return Array.from(pages).sort((a, b) => a - b);
    };

    const selectedIndices = useMemo(() => {
        if (!totalPages) return [];

        if (splitMode === "range") {
            const start = parseInt(startPage, 10);
            const end = parseInt(endPage, 10);

            if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > totalPages || end > totalPages) {
                return [];
            }

            const from = Math.min(start, end);
            const to = Math.max(start, end);
            const list: number[] = [];
            for (let i = from; i <= to; i++) {
                list.push(i - 1);
            }
            return list;
        } else {
            return parsePageRanges(customSelection, totalPages);
        }
    }, [splitMode, startPage, endPage, customSelection, totalPages]);

    const handleSplit = async () => {
        if (!file || !totalPages) return;

        if (selectedIndices.length === 0) {
            setError("Please verify your selected page range or selection sequence.");
            return;
        }

        setIsProcessing(true);
        setError("");
        setSuccess("");

        try {
            const arrayBuffer = await file.arrayBuffer();
            const { PDFDocument } = await import("pdf-lib");

            const srcPdf = await PDFDocument.load(arrayBuffer);
            const destPdf = await PDFDocument.create();

            const copiedPages = await destPdf.copyPages(srcPdf, selectedIndices);
            copiedPages.forEach((page) => destPdf.addPage(page));

            const pdfBytes = await destPdf.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const baseName = file.name.replace(/\.[^/.]+$/, "");
            const link = document.createElement("a");
            link.href = url;
            link.download = `${baseName}-split.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setSuccess("PDF pages successfully split and downloaded!");
        } catch {
            setError("Failed to split PDF. Ensure the file is not password-secured or corrupted.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <section className="flex flex-col gap-10">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                {/* File Dropzone & Configuration */}
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            Split PDF
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                            Extract specific pages or range selections.
                        </h2>
                    </div>

                    {!file ? (
                        /* Dropzone */
                        <div
                            {...getRootProps()}
                            className={`mt-6 flex min-h-[14rem] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed p-6 text-center transition-all ${isDragActive
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
                            <p className="mt-1 text-xs text-[var(--muted)]">Processes locally in browser memory. Secure and private.</p>
                        </div>
                    ) : (
                        /* Configuration Panel */
                        <div className="mt-6 space-y-6">
                            {/* File Card */}
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
                                            {totalPages !== null && ` • ${totalPages} ${totalPages === 1 ? "page" : "pages"}`}
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

                            {/* Split Method Tabs */}
                            <div>
                                <label className="text-sm font-semibold text-[var(--foreground)]">
                                    Splitting Mode
                                </label>
                                <div className="mt-3 flex rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setSplitMode("range")}
                                        className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-all ${splitMode === "range"
                                                ? "bg-[var(--card)] text-[var(--foreground)] shadow-[var(--shadow-soft)]"
                                                : "text-[var(--muted)] hover:text-[var(--foreground)]"
                                            }`}
                                    >
                                        Range Select
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSplitMode("custom")}
                                        className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-all ${splitMode === "custom"
                                                ? "bg-[var(--card)] text-[var(--foreground)] shadow-[var(--shadow-soft)]"
                                                : "text-[var(--muted)] hover:text-[var(--foreground)]"
                                            }`}
                                    >
                                        Custom Pages
                                    </button>
                                </div>
                            </div>

                            {/* Options Input Fields */}
                            {splitMode === "range" ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="start-page" className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                                            From Page
                                        </label>
                                        <input
                                            id="start-page"
                                            type="number"
                                            min="1"
                                            max={totalPages || 1}
                                            value={startPage}
                                            onChange={(e) => {
                                                setStartPage(e.target.value);
                                                setError("");
                                                setSuccess("");
                                            }}
                                            className="mt-2 h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-semibold outline-none focus:border-[var(--border-strong)]"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="end-page" className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                                            To Page
                                        </label>
                                        <input
                                            id="end-page"
                                            type="number"
                                            min="1"
                                            max={totalPages || 1}
                                            value={endPage}
                                            onChange={(e) => {
                                                setEndPage(e.target.value);
                                                setError("");
                                                setSuccess("");
                                            }}
                                            className="mt-2 h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-semibold outline-none focus:border-[var(--border-strong)]"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="custom-selection" className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                                        Selected Pages
                                    </label>
                                    <input
                                        id="custom-selection"
                                        type="text"
                                        placeholder="e.g. 1, 3, 5-7"
                                        value={customSelection}
                                        onChange={(e) => {
                                            setCustomSelection(e.target.value);
                                            setError("");
                                            setSuccess("");
                                        }}
                                        className="mt-2 h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-semibold outline-none focus:border-[var(--border-strong)]"
                                    />
                                    <p className="mt-2 text-xs text-[var(--muted)] leading-5">
                                        Use comma separators or hyphens for range groupings (e.g. <code>1, 3, 5-7</code> extracts page 1, 3, 5, 6, and 7).
                                    </p>
                                </div>
                            )}

                            {/* Extract Live Summary Info */}
                            {selectedIndices.length > 0 && totalPages && (
                                <div className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent-soft)]/10 px-4 py-3">
                                    <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                                        Live Extraction Preview
                                    </p>
                                    <p className="mt-1.5 text-sm text-[var(--foreground)] font-semibold leading-relaxed">
                                        Will extract {selectedIndices.length} {selectedIndices.length === 1 ? "page" : "pages"}:{" "}
                                        <span className="text-[var(--accent)]">
                                            {selectedIndices.map((idx) => idx + 1).join(", ")}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Operations & Summary Panel */}
                <div className="flex flex-col gap-6">
                    <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            Split Summary
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                            Execution Details
                        </h3>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <StatCard label="Original Pages" value={totalPages || "-"} />
                            <StatCard label="Pages to Extract" value={selectedIndices.length || "-"} />
                            <StatCard label="Split Mode" value={splitMode.toUpperCase()} />
                            <StatCard label="Output Format" value="PDF Document" />
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={handleSplit}
                                disabled={isProcessing || !file || selectedIndices.length === 0}
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0"
                            >
                                {isProcessing ? (
                                    <span className="flex items-center gap-2">
                                        <SpinnerIcon /> Splitting PDF...
                                    </span>
                                ) : (
                                    "Split PDF & Download"
                                )}
                            </button>
                            {file && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-transparent px-5 text-sm font-semibold text-[var(--muted)] transition-transform hover:-translate-y-0.5 hover:text-[var(--foreground)]"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
                                {success}
                            </div>
                        )}
                    </div>

                    <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            Privacy First
                        </p>
                        <h4 className="mt-2 text-base font-semibold text-[var(--foreground)]">
                            100% Client-Side splitting
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                            The pages are copied and re-assembled directly on your system. None of your document data is sent across the web, ensuring complete confidentiality.
                        </p>
                    </div>
                </div>
            </div>

            {/* Informational Content Section */}
            <hr className="border-[var(--border)]" />
            <article className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">What is Split PDF?</h2>
                    <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                        Split PDF is a browser-based utility that extracts page ranges or customized page listings from a PDF file. Working in cooperation with client-side JavaScript PDF parsers, this tool reads the source structure, clones target page indices, and writes them into a downloadable output PDF.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">How to Use Split PDF</h2>
                    <ol className="mt-2 list-decimal list-inside space-y-2 text-base leading-7 text-[var(--muted)]">
                        <li>Drag and drop your PDF file, or click to load from local file directories.</li>
                        <li>Choose your splitting mode: Range Select (e.g. from page 2 to 5) or Custom Pages (e.g. 1, 3, 5-7).</li>
                        <li>Verify the extracted page preview is exactly what you want.</li>
                        <li>Click Split PDF & Download to download the new PDF.</li>
                    </ol>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Benefits</h3>
                        <ul className="mt-2 list-disc list-inside space-y-2 text-sm leading-6 text-[var(--muted)]">
                            <li><strong>Local Splitting</strong>: Complete offline document parsing with zero uploads.</li>
                            <li><strong>Extremely Flexible Selection</strong>: Extract discrete pages, ranges, or custom lists together.</li>
                            <li><strong>Lightweight & Secure</strong>: No registration or signup, no usage thresholds, and total privacy.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Frequently Asked Questions (FAQ)</h3>
                        <div className="mt-2 space-y-3 text-sm leading-6 text-[var(--muted)]">
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Can I split password-protected files?</p>
                                <p>No. For security and permission reasons, our tool only splits standard open files. Encrypted or protected documents cannot be read in the browser.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Does it reduce PDF image quality?</p>
                                <p>No. Pages are copied structurally, meaning all text layers, font definitions, and high-res vector graphics remain exactly as they were in the source file.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </section>
    );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-soft)]">
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                {label}
            </span>
            <span className="mt-2 block text-2xl font-bold tracking-tight text-[var(--foreground)]">
                {value}
            </span>
        </div>
    );
}

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
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
