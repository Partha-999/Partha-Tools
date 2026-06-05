"use client";

import Link from "next/link";

import type { Tool, ToolIconName } from "@/data/tools";

const toolIconMap: Record<ToolIconName, string> = {
    "json-formatter": "M8 8h8M8 12h8M8 16h5M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    "json-validator": "M7 12l3 3 7-7M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    "base64-encoder": "M7 8h10M7 12h10M7 16h6M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    "base64-decoder": "M8 8 12 12 8 16M16 8 12 12 16 16M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    "jwt-decoder": "M12 3l7 4v5c0 5-3.5 9.7-7 9.7S5 17 5 12V7l7-4z",
    "qr-generator": "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM15 15h2v2h-2zM19 15h1v1h-1zM15 19h1v1h-1zM19 19h1v1h-1z",
    "password-generator": "M6 12a6 6 0 1 1 12 0 6 6 0 0 1-12 0zM12 9v6M9 12h6",
    "url-encoder": "M8 16a4 4 0 0 1 0-8h2M16 8a4 4 0 0 1 0 8h-2M9 12h6",
    "url-decoder": "M16 8a4 4 0 0 1 0 8h-2M8 16a4 4 0 0 1 0-8h2M9 12h6",
    "word-counter": "M6 7h12M6 12h8M6 17h10",
    "character-counter": "M7 7h10M7 12h10M7 17h6",
    "merge-pdf": "M4 18h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z M22 8v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2",
    "compress-pdf": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M12 18v-4M9 15l3 3 3-3 M12 10v4M15 13l-3-3-3 3",
    "jpg-to-pdf": "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z M14 2v4a1 1 0 0 0 1 1h4 M9 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M7 18l2.5-2.5 2 2 4-4 2.5 2.5",
    "pdf-to-jpg": "M14 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M14 2v6h6 M22 15v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2z",
    "split-pdf": "M14 2H6a2 2 0 0 0-2 2v7h16V8z M20 13H4v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z M2 11h20",
};

export function ToolCard({ tool }: { tool: Tool }) {
    return (
        <Link
            href={`/tools/${tool.slug}`}
            className="group flex h-full flex-col rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-5 text-left shadow-[var(--shadow-soft)] backdrop-blur transition-transform hover:-translate-y-1 hover:border-[var(--border-strong)]"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--accent-soft)] text-[var(--accent)]">
                    <ToolIcon icon={tool.icon} />
                </div>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                    {tool.category}
                </span>
            </div>

            <h3 className="mt-5 text-lg font-semibold text-[var(--foreground)]">{tool.name}</h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">{tool.description}</p>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                Open tool
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                </span>
            </div>
        </Link>
    );
}

function ToolIcon({ icon }: { icon: ToolIconName }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d={toolIconMap[icon]} />
        </svg>
    );
}
