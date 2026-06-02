import type { Metadata } from "next";
import Link from "next/link";

import { Base64EncoderTool } from "@/components/base64-encoder-tool";
import { getToolMetadata } from "@/utils/metadata";

export const metadata: Metadata = getToolMetadata(
    "base64-encoder",
    "Base64 Encoder | ParthaTools",
    "Encode UTF-8 text to Base64 instantly with ParthaTools."
);

export default function Base64EncoderPage() {
    return (
        <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <header className="flex flex-col gap-4 rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] px-4 py-4 shadow-[var(--shadow-soft)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                        Developer Tools
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                        Base64 Encoder
                    </h1>
                </div>
                <Link href="/" className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
                    Back to home
                </Link>
            </header>

            <Base64EncoderTool />
        </main>
    );
}
