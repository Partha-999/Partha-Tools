import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ToolCard } from "@/components/tool-card";
import { getToolBySlug, tools } from "@/data/tools";

type ToolPageProps = {
    params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
    return tools
        .filter(
            (tool) =>
                tool.slug !== "base64-decoder" &&
                tool.slug !== "base64-encoder" &&
                tool.slug !== "json-formatter" &&
                tool.slug !== "json-validator" &&
                tool.slug !== "qr-generator" &&
                tool.slug !== "password-generator" &&
                tool.slug !== "jwt-decoder" &&
                tool.slug !== "url-encoder" &&
                tool.slug !== "url-decoder" &&
                tool.slug !== "word-counter" &&
                tool.slug !== "character-counter" &&
                tool.slug !== "merge-pdf" &&
                tool.slug !== "compress-pdf" &&
                tool.slug !== "jpg-to-pdf" &&
                tool.slug !== "pdf-to-jpg" &&
                tool.slug !== "split-pdf",
        )
        .map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
    const { slug } = await params;

    if (
        slug === "json-formatter" ||
        slug === "json-validator" ||
        slug === "qr-generator" ||
        slug === "password-generator" ||
        slug === "base64-encoder" ||
        slug === "base64-decoder" ||
        slug === "jwt-decoder" ||
        slug === "url-encoder" ||
        slug === "url-decoder" ||
        slug === "word-counter" ||
        slug === "character-counter" ||
        slug === "merge-pdf" ||
        slug === "compress-pdf" ||
        slug === "jpg-to-pdf" ||
        slug === "pdf-to-jpg" ||
        slug === "split-pdf"
    ) {
        return {
            title: "Tool",
            description: "Dedicated tool page on ParthaTools.",
            alternates: {
                canonical: `/tools/${slug}`,
            },
            openGraph: {
                title: "Tool | ParthaTools",
                description: "Dedicated tool page on ParthaTools.",
                url: `https://www.parthatools.me/tools/${slug}`,
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Tool | ParthaTools",
                description: "Dedicated tool page on ParthaTools.",
            },
        };
    }

    const tool = getToolBySlug(slug);

    if (!tool) {
        return {
            title: "Tool not found",
            description: "The requested tool could not be found in the ParthaTools registry.",
            alternates: {
                canonical: `/tools/${slug}`,
            },
            openGraph: {
                title: "Tool not found | ParthaTools",
                description: "The requested tool could not be found in the ParthaTools registry.",
                url: `https://www.parthatools.me/tools/${slug}`,
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Tool not found | ParthaTools",
                description: "The requested tool could not be found in the ParthaTools registry.",
            },
        };
    }

    return {
        title: tool.seoTitle,
        description: tool.seoDescription,
        alternates: {
            canonical: `/tools/${tool.slug}`,
        },
        openGraph: {
            title: tool.seoTitle,
            description: tool.seoDescription,
            url: `https://www.parthatools.me/tools/${tool.slug}`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: tool.seoTitle,
            description: tool.seoDescription,
        },
    };
}

export default async function ToolPage({ params }: ToolPageProps) {
    const { slug } = await params;

    if (
        slug === "json-formatter" ||
        slug === "json-validator" ||
        slug === "qr-generator" ||
        slug === "password-generator" ||
        slug === "base64-encoder" ||
        slug === "base64-decoder" ||
        slug === "jwt-decoder" ||
        slug === "url-encoder" ||
        slug === "url-decoder" ||
        slug === "word-counter" ||
        slug === "character-counter" ||
        slug === "merge-pdf" ||
        slug === "compress-pdf" ||
        slug === "jpg-to-pdf" ||
        slug === "pdf-to-jpg" ||
        slug === "split-pdf"
    ) {
        notFound();
    }

    const tool = getToolBySlug(slug);

    if (!tool) {
        notFound();
    }

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur">
                <Link href="/" className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
                    Back to home
                </Link>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                    {tool.category}
                </p>
            </div>

            <section className="grid gap-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 shadow-[var(--shadow)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                        {tool.id}
                    </p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
                        {tool.name}
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
                        {tool.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3 text-sm">
                        <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 font-semibold text-[var(--foreground)]">
                            SEO title: {tool.seoTitle}
                        </span>
                        <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 font-semibold text-[var(--foreground)]">
                            Category: {tool.category}
                        </span>
                    </div>
                </div>

                <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--background)]/70 p-5 shadow-[var(--shadow-soft)]">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                        Tool preview
                    </p>
                    <div className="mt-5">
                        <ToolCard tool={tool} />
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <InfoCard title="Description" value={tool.seoDescription} />
                <InfoCard title="Slug" value={tool.slug} />
                <InfoCard title="ID" value={tool.id} />
            </section>
        </main>
    );
}

function InfoCard({ title, value }: { title: string; value: string }) {
    return (
        <article className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">{title}</p>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">{value}</p>
        </article>
    );
}
