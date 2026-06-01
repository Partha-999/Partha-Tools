import type { Metadata } from "next";
import Link from "next/link";

import { JWTDecoderTool } from "@/components/jwt-decoder-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("jwt-decoder");

export const metadata: Metadata = tool
    ? {
        title: tool.seoTitle,
        description: tool.seoDescription,
    }
    : {
        title: "JWT Decoder | ParthaTools",
        description: "Decode JSON Web Tokens (JWT) and inspect claims with clarity.",
    };

export default function JWTDecoderPage() {
    return (
        <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <header className="flex flex-col gap-4 rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] px-4 py-4 shadow-[var(--shadow-soft)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                        {tool?.category || "Developer Tools"}
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                        {tool?.name || "JWT Decoder"}
                    </h1>
                </div>
                <Link href="/" className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
                    Back to home
                </Link>
            </header>

            <JWTDecoderTool />
        </main>
    );
}
