"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface PDFPageItem {
    pageNumber: number;
    dataUrl: string;
}

export function PDFToJPGTool() {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PDFPageItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isZipping, setIsZipping] = useState(false);
    const [progress, setProgress] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const renderPDFPages = async (uploadedFile: File) => {
        setIsLoading(true);
        setError("");
        setSuccess("");
        setPages([]);
        setProgress("Loading PDF document...");

        try {
            const pdfjs = await import("pdfjs-dist");
            // Set the workerSrc dynamically from a public CDN
            pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

            const arrayBuffer = await uploadedFile.arrayBuffer();
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const pdfDoc = await loadingTask.promise;
            const totalPages = pdfDoc.numPages;

            const renderedPages: PDFPageItem[] = [];

            for (let i = 1; i <= totalPages; i++) {
                setProgress(`Rendering page ${i} of ${totalPages}...`);
                const page = await pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // high quality 2x resolution

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                if (!context) {
                    throw new Error("Failed to create 2D canvas context.");
                }

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                    canvas: canvas,
                };

                await page.render(renderContext).promise;

                const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
                renderedPages.push({
                    pageNumber: i,
                    dataUrl,
                });
            }

            setPages(renderedPages);
            setSuccess(`Successfully rendered all ${totalPages} pages to JPG!`);
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : "Failed to render PDF file. Please ensure it is not password-protected or corrupted.";
            setError(errMsg);
        } finally {
            setIsLoading(false);
            setProgress("");
        }
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const uploadedFile = acceptedFiles[0];
        if (!uploadedFile) return;

        if (uploadedFile.type !== "application/pdf" && !uploadedFile.name.endsWith(".pdf")) {
            setError("Only PDF files are supported.");
            return;
        }

        setFile(uploadedFile);
        await renderPDFPages(uploadedFile);
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
        setPages([]);
        setError("");
        setSuccess("");
        setProgress("");
    };

    const handleDownloadSingle = (page: PDFPageItem) => {
        if (!file) return;
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const link = document.createElement("a");
        link.href = page.dataUrl;
        link.download = `${baseName}-page-${page.pageNumber}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadAllZip = async () => {
        if (!file || pages.length === 0) return;

        setIsZipping(true);
        setError("");
        setSuccess("");

        try {
            const JSZip = (await import("jszip")).default;
            const { saveAs } = await import("file-saver");

            const zip = new JSZip();
            const baseName = file.name.replace(/\.[^/.]+$/, "");

            for (const page of pages) {
                const base64Data = page.dataUrl.split(",")[1];
                zip.file(`${baseName}-page-${page.pageNumber}.jpg`, base64Data, { base64: true });
            }

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${baseName}-jpg-pages.zip`);
            setSuccess("ZIP file downloaded successfully!");
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : "Failed to generate ZIP archive.";
            setError(errMsg);
        } finally {
            setIsZipping(false);
        }
    };

    return (
        <section className="flex flex-col gap-10">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Upload & List */}
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            PDF to JPG
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                            Convert PDF pages into high-quality JPG images.
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
                            <p className="mt-1 text-xs text-[var(--muted)]">Processes pages entirely in your browser. Complete privacy.</p>
                        </div>
                    ) : (
                        /* Selected File Details */
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
                                            {pages.length > 0 && ` • ${pages.length} ${pages.length === 1 ? "page" : "pages"}`}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    disabled={isLoading}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                    title="Remove File"
                                >
                                    <CloseIcon />
                                </button>
                            </div>

                            {/* Rendered Preview Grid */}
                            {pages.length > 0 && (
                                <div className="space-y-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                                        Rendered Pages Preview ({pages.length})
                                    </p>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {pages.map((page) => (
                                            <div
                                                key={page.pageNumber}
                                                className="group relative flex flex-col items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/40 p-3"
                                            >
                                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={page.dataUrl}
                                                        alt={`Page ${page.pageNumber}`}
                                                        className="h-full w-full object-contain"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDownloadSingle(page)}
                                                            className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-gray-900 shadow-md transition-transform hover:scale-105"
                                                        >
                                                            Download JPG
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex w-full items-center justify-between px-1">
                                                    <span className="text-xs font-semibold text-[var(--muted)]">
                                                        Page {page.pageNumber}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDownloadSingle(page)}
                                                        className="text-xs font-bold text-[var(--accent)] hover:underline sm:hidden"
                                                    >
                                                        Download
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Status & ZIP Download */}
                <div className="flex flex-col gap-6">
                    <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            Export Panel
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                            Render Settings
                        </h3>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <StatCard label="PDF Pages" value={file ? (pages.length > 0 ? pages.length : "Analyzing...") : "-"} />
                            <StatCard label="Scale" value="2.0x (High-Res)" />
                            <StatCard label="Image Quality" value="95% JPG" />
                            <StatCard label="Target Output" value="ZIP / Individual" />
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={handleDownloadAllZip}
                                disabled={isZipping || isLoading || pages.length === 0}
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0"
                            >
                                {isZipping ? (
                                    <span className="flex items-center gap-2">
                                        <SpinnerIcon /> Creating ZIP...
                                    </span>
                                ) : (
                                    "Download All Pages (ZIP)"
                                )}
                            </button>
                            {file && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    disabled={isLoading}
                                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-transparent px-5 text-sm font-semibold text-[var(--muted)] transition-transform hover:-translate-y-0.5 hover:text-[var(--foreground)] disabled:opacity-50"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        {progress && (
                            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 px-4 py-3 text-sm text-[var(--muted)]">
                                <SpinnerIcon className="text-[var(--accent)] animate-spin" />
                                <span>{progress}</span>
                            </div>
                        )}

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
                            No Server Storage
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                            Your files are loaded and parsed locally in memory. The tool does not store, cache, or send your PDF content or rendered JPG images to any server.
                        </p>
                    </div>
                </div>
            </div>

            {/* Informational Content Section */}
            <hr className="border-[var(--border)]" />
            <article className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">What is PDF to JPG?</h2>
                    <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                        PDF to JPG is a modern utility that lets you render any PDF document page by page into standalone JPG images directly within your browser. By utilizing the PDF.js parsing engine, page layers are flattened onto canvases and converted to downloadable image assets, keeping your data confidential.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">How to Use PDF to JPG</h2>
                    <ol className="mt-2 list-decimal list-inside space-y-2 text-base leading-7 text-[var(--muted)]">
                        <li>Drag and drop your PDF file into the upload dropzone, or click to browse files from your computer.</li>
                        <li>The application will automatically initialize the script, parse the pages, and start rendering thumbnails.</li>
                        <li>Click Download JPG on any single page to export that page, or click Download All Pages (ZIP) to download all rendered pages in a single archive.</li>
                    </ol>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Benefits</h3>
                        <ul className="mt-2 list-disc list-inside space-y-2 text-sm leading-6 text-[var(--muted)]">
                            <li><strong>Local Conversion</strong>: Pages render on your local hardware for zero server-side leaks.</li>
                            <li><strong>High Quality Rendering</strong>: Uses a 2x viewport scale for crisp, legible text and image reproduction.</li>
                            <li><strong>ZIP Compacting</strong>: Bundles all pages together in a standard ZIP file.</li>
                            <li><strong>Secure & Fast</strong>: Conversions start instantly without needing network uploads.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Frequently Asked Questions (FAQ)</h3>
                        <div className="mt-2 space-y-3 text-sm leading-6 text-[var(--muted)]">
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Is there a maximum page limit?</p>
                                <p>No limits are imposed, but large PDF documents (e.g. 100+ pages) may cause temporary browser memory strain during rendering.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">Are my files stored anywhere?</p>
                                <p>Absolutely not. The file processing happens entirely inside your local browser memory sandboxed environment.</p>
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

function SpinnerIcon({ className = "h-4 w-4 text-white" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}
