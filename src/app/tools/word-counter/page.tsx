import type { Metadata } from "next";
import Link from "next/link";

import { WordCounterTool } from "@/components/word-counter-tool";
import { getToolBySlug } from "@/data/tools";
import { getToolMetadata } from "@/utils/metadata";
import { ToolDetails } from "@/components/tool-details";

const tool = getToolBySlug("word-counter");

export const metadata: Metadata = getToolMetadata(
    "word-counter",
    "Word Counter | ParthaTools",
    "Count words, estimate reading and speaking time, and check keyword density."
);

export default function WordCounterPage() {
    return (
        <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <header className="flex flex-col gap-4 rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] px-4 py-4 shadow-[var(--shadow-soft)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                        {tool?.category || "Text Tools"}
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                        {tool?.name || "Word Counter"}
                    </h1>
                </div>
                <Link href="/" className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
                    Back to home
                </Link>
            </header>

            <WordCounterTool />
            <ToolDetails slug="word-counter" />
        </main>
    );
}
