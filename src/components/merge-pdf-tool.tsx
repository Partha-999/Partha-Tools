"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

interface PDFFileItem {
    id: string;
    file: File;
    name: string;
    size: number;
    pagesCount: number | null;
    error: string | null;
}

export function MergePDFTool() {
    const [files, setFiles] = useState<PDFFileItem[]>([]);
    const [isMerging, setIsMerging] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setError("");
        setSuccess("");

        const newItems = await Promise.all(
            acceptedFiles.map(async (file) => {
                const id = Math.random().toString(36).substring(7);
                let pagesCount: number | null = null;
                let errorMsg: string | null = null;

                if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
                    errorMsg = "Only PDF files are supported.";
                } else {
                    try {
                        const arrayBuffer = await file.arrayBuffer();
                        const { PDFDocument } = await import("pdf-lib");
                        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                        pagesCount = pdfDoc.getPageCount();
                    } catch {
                        errorMsg = "Failed to parse PDF (encrypted or corrupted).";
                    }
                }

                return {
                    id,
                    file,
                    name: file.name,
                    size: file.size,
                    pagesCount,
                    error: errorMsg,
                };
            })
        );

        setFiles((prev) => [...prev, ...newItems]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
        },
        multiple: true,
    });

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
        setError("");
        setSuccess("");
    };

    const moveFile = (index: number, direction: "up" | "down") => {
        setFiles((prev) => {
            const next = [...prev];
            const targetIndex = direction === "up" ? index - 1 : index + 1;

            if (targetIndex < 0 || targetIndex >= next.length) return prev;

            const temp = next[index];
            next[index] = next[targetIndex];
            next[targetIndex] = temp;

            return next;
        });
        setError("");
        setSuccess("");
    };

    const clearAll = () => {
        setFiles([]);
        setError("");
        setSuccess("");
    };

    const stats = useMemo(() => {
        let totalPages = 0;
        let totalSize = 0;
        let validCount = 0;

        files.forEach((f) => {
            totalSize += f.size;
            if (!f.error && f.pagesCount !== null) {
                totalPages += f.pagesCount;
                validCount += 1;
            }
        });

        return {
            totalPages,
            totalSize: formatBytes(totalSize),
            validCount,
        };
    }, [files]);

    const handleMerge = async () => {
        const validFiles = files.filter((f) => !f.error && f.pagesCount !== null);

        if (validFiles.length < 2) {
            setError("Please upload at least two valid PDF files to merge.");
            return;
        }

        setIsMerging(true);
        setError("");
        setSuccess("");

        try {
            const { PDFDocument } = await import("pdf-lib");
            const mergedPdf = await PDFDocument.create();

            for (const item of validFiles) {
                const arrayBuffer = await item.file.arrayBuffer();
                const srcPdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "merged-document.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setSuccess("PDF files successfully combined and downloaded!");
        } catch {
            setError("An error occurred while merging the PDF files. Please verify that none of the documents are encrypted or password-protected.");
        } finally {
            setIsMerging(false);
        }
    };

    return (
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Upload Area & List */}
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                        Merge PDF
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                        Combine multiple PDF documents into a single file locally.
                    </h2>
                </div>

                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={`mt-6 flex min-h-[12rem] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed p-6 text-center transition-all ${isDragActive
                            ? "border-[var(--accent)] bg-[var(--accent-soft)]/20"
                            : "border-[var(--border)] bg-[var(--background)]/50 hover:border-[var(--border-strong)]"
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--accent-soft)] text-[var(--accent)]">
                        <UploadIcon />
                    </div>
                    <p className="mt-4 text-base font-semibold text-[var(--foreground)]">
                        {isDragActive ? "Drop PDF files here..." : "Drag & drop PDF files here, or click to browse"}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)]">Supports multiple PDF uploads. Processed entirely in browser.</p>
                </div>

                {/* Files List */}
                {files.length > 0 && (
                    <div className="mt-6 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                            Uploaded PDF Files ({files.length})
                        </p>
                        <div className="space-y-2.5">
                            {files.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center justify-between gap-4 rounded-2xl border p-3.5 transition-all ${item.error
                                            ? "border-red-500/20 bg-red-500/5"
                                            : "border-[var(--border)] bg-[var(--background)]/60"
                                        }`}
                                >
                                    {/* Info Panel */}
                                    <div className="flex flex-1 items-center gap-3.5 min-w-0">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--card)] font-mono text-xs font-bold text-[var(--muted)] border border-[var(--border)]">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-[var(--foreground)]" title={item.name}>
                                                {item.name}
                                            </p>
                                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--muted)]">
                                                <span>{formatBytes(item.size)}</span>
                                                {item.pagesCount !== null && (
                                                    <>
                                                        <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
                                                        <span>{item.pagesCount} {item.pagesCount === 1 ? "page" : "pages"}</span>
                                                    </>
                                                )}
                                            </div>
                                            {item.error && (
                                                <p className="mt-1 text-xs font-semibold text-red-500">{item.error}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => moveFile(index, "up")}
                                            disabled={index === 0}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                            title="Move Up"
                                            aria-label="Move file up"
                                        >
                                            <ChevronUpIcon />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveFile(index, "down")}
                                            disabled={index === files.length - 1}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                            title="Move Down"
                                            aria-label="Move file down"
                                        >
                                            <ChevronDownIcon />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(item.id)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors"
                                            title="Delete File"
                                            aria-label="Delete file"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Merge Actions & Stats */}
            <div className="flex flex-col gap-6">
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                        Merge Summary
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                        Merge Statistics
                    </h3>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <StatCard label="Total Files" value={files.length} />
                        <StatCard label="Valid Files" value={stats.validCount} />
                        <StatCard label="Total Pages" value={stats.validCount > 0 ? stats.totalPages : 0} />
                        <StatCard label="Total Size" value={stats.totalSize} />
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={handleMerge}
                            disabled={isMerging || stats.validCount < 2}
                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0"
                        >
                            {isMerging ? (
                                <span className="flex items-center gap-2">
                                    <SpinnerIcon /> Merging PDFs...
                                </span>
                            ) : (
                                "Merge PDFs & Download"
                            )}
                        </button>
                        {files.length > 0 && (
                            <button
                                type="button"
                                onClick={clearAll}
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
                        100% Client-Side Merging
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        All PDF files are loaded, parsed, and combined locally in your web browser. None of your document data is uploaded or transmitted to any server.
                    </p>
                </div>
            </div>
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

function ChevronUpIcon() {
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
            <polyline points="18 15 12 9 6 15" />
        </svg>
    );
}

function ChevronDownIcon() {
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
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

function TrashIcon() {
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
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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
