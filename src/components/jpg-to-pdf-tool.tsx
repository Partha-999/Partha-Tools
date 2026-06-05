"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { jsPDF as jsPDFType } from "jspdf";

interface ImageFileItem {
    id: string;
    file: File;
    name: string;
    size: number;
    previewUrl: string;
    error: string | null;
}

export function JPGToPDFTool() {
    const [files, setFiles] = useState<ImageFileItem[]>([]);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setError("");
        setSuccess("");

        const newItems = acceptedFiles.map((file) => {
            const id = Math.random().toString(36).substring(7);
            let errorMsg: string | null = null;

            const isImage = file.type.startsWith("image/") || 
                            file.name.endsWith(".jpg") || 
                            file.name.endsWith(".jpeg") || 
                            file.name.endsWith(".png");

            if (!isImage) {
                errorMsg = "Only JPG, JPEG, and PNG images are supported.";
            }

            return {
                id,
                file,
                name: file.name,
                size: file.size,
                previewUrl: isImage ? URL.createObjectURL(file) : "",
                error: errorMsg,
            };
        });

        setFiles((prev) => [...prev, ...newItems]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
        },
        multiple: true,
    });

    const removeFile = (id: string) => {
        setFiles((prev) => {
            const item = prev.find((f) => f.id === id);
            if (item && item.previewUrl) {
                URL.revokeObjectURL(item.previewUrl);
            }
            return prev.filter((f) => f.id !== id);
        });
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
        files.forEach((f) => {
            if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
        });
        setFiles([]);
        setError("");
        setSuccess("");
    };

    const stats = useMemo(() => {
        let totalSize = 0;
        let validCount = 0;

        files.forEach((f) => {
            totalSize += f.size;
            if (!f.error) {
                validCount += 1;
            }
        });

        return {
            totalSize: formatBytes(totalSize),
            validCount,
        };
    }, [files]);

    const handleConvert = async () => {
        const validFiles = files.filter((f) => !f.error);

        if (validFiles.length === 0) {
            setError("Please upload at least one valid image to convert.");
            return;
        }

        setIsConverting(true);
        setError("");
        setSuccess("");

        try {
            const { jsPDF } = await import("jspdf");
            let pdf: jsPDFType | null = null;

            const loadImage = (url: string): Promise<HTMLImageElement> => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error("Failed to load image"));
                });
            };

            const fileToDataURL = (file: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject(new Error("Failed to read file"));
                    reader.readAsDataURL(file);
                });
            };

            for (let i = 0; i < validFiles.length; i++) {
                const item = validFiles[i];
                const dataUrl = await fileToDataURL(item.file);
                const img = await loadImage(dataUrl);

                // Use exact dimensions of the image to prevent scaling losses
                const width = img.naturalWidth || img.width;
                const height = img.naturalHeight || img.height;
                const orientation = width > height ? "l" : "p";

                if (i === 0) {
                    pdf = new jsPDF({
                        orientation,
                        unit: "px",
                        format: [width, height],
                        hotfixes: ["px_scaling"],
                    });
                } else if (pdf) {
                    pdf.addPage([width, height], orientation);
                }

                if (pdf) {
                    const formatType = item.file.type === "image/png" ? "PNG" : "JPEG";
                    pdf.addImage(dataUrl, formatType, 0, 0, width, height);
                }
            }

            if (pdf) {
                pdf.save("converted-images.pdf");
                setSuccess("Images successfully converted into a PDF document!");
            } else {
                setError("No PDF was created.");
            }
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : "An error occurred while converting the images. Please verify that your files are valid JPEGs or PNGs.";
            setError(errMsg);
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <section className="flex flex-col gap-10">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Upload Area & List */}
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            JPG to PDF
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                            Convert JPG and PNG images into a PDF document.
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
                            {isDragActive ? "Drop image files here..." : "Drag & drop JPG/PNG files here, or click to browse"}
                        </p>
                        <p className="mt-1 text-xs text-[var(--muted)]">Supports JPEG, JPG, and PNG formats. Processed locally.</p>
                    </div>

                    {/* Files List */}
                    {files.length > 0 && (
                        <div className="mt-6 space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                                Uploaded Images ({files.length})
                            </p>
                            <div className="space-y-2.5">
                                {files.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center justify-between gap-4 rounded-2xl border p-3 transition-all ${item.error
                                                ? "border-red-500/20 bg-red-500/5"
                                                : "border-[var(--border)] bg-[var(--background)]/60"
                                            }`}
                                    >
                                        {/* Info & Thumbnail */}
                                        <div className="flex flex-1 items-center gap-3.5 min-w-0">
                                            {/* Thumbnail */}
                                            {item.previewUrl && !item.error ? (
                                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={item.previewUrl}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--muted)]">
                                                    <ImageIcon />
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-[var(--foreground)]" title={item.name}>
                                                    {item.name}
                                                </p>
                                                <p className="mt-1 text-xs text-[var(--muted)]">
                                                    {formatBytes(item.size)}
                                                </p>
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

                {/* Conversion Summary & Details */}
                <div className="flex flex-col gap-6">
                    <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            Conversion Summary
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                            File Information
                        </h3>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <StatCard label="Total Files" value={files.length} />
                            <StatCard label="Valid Images" value={stats.validCount} />
                            <StatCard label="Total Size" value={stats.totalSize} />
                            <StatCard label="Export Format" value="PDF Document" />
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={handleConvert}
                                disabled={isConverting || stats.validCount === 0}
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0"
                            >
                                {isConverting ? (
                                    <span className="flex items-center gap-2">
                                        <SpinnerIcon /> Converting...
                                    </span>
                                ) : (
                                    "Convert to PDF & Download"
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
                            100% Secure Local Conversions
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                            All processing happens locally in your web browser. Your images are never sent to external servers, protecting your security and private info.
                        </p>
                    </div>
                </div>
            </div>

            {/* Informational Content Section */}
            <hr className="border-[var(--border)]" />
            <article className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">What is JPG to PDF?</h2>
                    <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                        JPG to PDF is a browser-based utility that lets you compile one or more JPG, JPEG, or PNG images into a single PDF document. By utilizing standard client-side PDF technologies, this tool converts your images immediately in the browser without uploading them to external servers.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">How to Use JPG to PDF</h2>
                    <ol className="mt-2 list-decimal list-inside space-y-2 text-base leading-7 text-[var(--muted)]">
                        <li>Drag and drop your images into the designated upload area or click to browse files.</li>
                        <li>Review your uploaded images. Use the Up and Down buttons to adjust the sequence of pages.</li>
                        <li>Click <strong>Convert to PDF & Download</strong> to initialize the script and compile the pages.</li>
                        <li>The compiled PDF file will automatically begin downloading to your device.</li>
                    </ol>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Benefits</h3>
                        <ul className="mt-2 list-disc list-inside space-y-2 text-sm leading-6 text-[var(--muted)]">
                            <li><strong>Local Processing</strong>: Complete confidentiality with offline conversions.</li>
                            <li><strong>Image Preservation</strong>: Generates PDF pages matching the exact dimensions and scale of the original images.</li>
                            <li><strong>Zero Sign-ups</strong>: Instant usage with no monthly subscriptions or auth flows.</li>
                            <li><strong>Multi-Format</strong>: Seamless support for both JPG/JPEG and PNG image types.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Frequently Asked Questions (FAQ)</h3>
                        <div className="mt-2 space-y-3 text-sm leading-6 text-[var(--muted)]">
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Is there a file size limit?</p>
                                <p>No arbitrary limit is enforced by our tool, but performance depends on your device&apos;s available browser memory.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Can I convert PNG files too?</p>
                                <p>Yes! PNG and JPEG images are both supported and can be mixed together in the same PDF compilation.</p>
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

function ImageIcon() {
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
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
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
