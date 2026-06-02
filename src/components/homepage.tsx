"use client";

import { useState } from "react";
import { ToolCard as RegistryToolCard } from "@/components/tool-card";
import { searchTools, toolCategories, tools, type ToolCategoryMeta } from "@/data/tools";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";


const stats = [
    { value: `${tools.length}`, label: "Utility Tools" },
    { value: `${toolCategories.length}`, label: "Tool Categories" },
    { value: "100%", label: "Free Tools" },
    { value: "Local", label: "Browser Based" },
    { value: "Zero Auth", label: "No Sign Up Required" },
];

export function HomePage() {
    const [query, setQuery] = useState("");

    const filteredTools = searchTools(query);
    const normalizedQuery = query.trim().toLowerCase();
    const filteredCategories = toolCategories.filter((category) => {
        if (!normalizedQuery) {
            return true;
        }

        const categoryMatches = [category.name, category.description].some((value) =>
            value.toLowerCase().includes(normalizedQuery),
        );
        const toolMatches = filteredTools.some((tool) => tool.category === category.name);

        return categoryMatches || toolMatches;
    });

    return (
        <main className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.14),transparent_28%)]" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pb-20">
                <Header />
                <Hero query={query} onQueryChange={setQuery} />
                <StatsRow />
                
                <SectionBlock
                    id="categories"
                    eyebrow="Browse by category"
                    title="Explore utilities by category"
                    description="Find tools grouped by their purpose, from development tasks to text editing and PDF manipulation."
                >
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {filteredCategories.map((category) => (
                            <CategoryCard
                                key={category.name}
                                category={category}
                                count={tools.filter((tool) => tool.category === category.name).length}
                                onSelect={setQuery}
                            />
                        ))}
                    </div>
                    {filteredCategories.length === 0 ? (
                        <EmptyState label="No categories matched your search." />
                    ) : null}
                </SectionBlock>

                <SectionBlock
                    id="popular-tools"
                    eyebrow="All Utilities"
                    title="Find and launch tools instantly"
                    description="Search across our full directory or browse our fast, browser-based utilities below."
                >
                    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        {filteredTools.map((tool) => (
                            <RegistryToolCard key={tool.slug} tool={tool} />
                        ))}
                    </div>
                    {filteredTools.length === 0 ? <EmptyState label="No tools matched your search." /> : null}
                </SectionBlock>

                <Footer />
            </div>
        </main>
    );
}

function Hero({
    query,
    onQueryChange,
}: {
    query: string;
    onQueryChange: (value: string) => void;
}) {
    return (
        <section id="top" className="flex flex-col items-center text-center pt-6 pb-2 max-w-4xl mx-auto w-full">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--muted)] shadow-[var(--shadow-soft)] backdrop-blur mb-5">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
                Browser-based developer & web utility tools
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl max-w-3xl">
                Refined Developer Tools
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                Find and use client-side utility tools instantly. No sign-up required, 100% secure.
            </p>

            <div className="w-full max-w-2xl mt-5">
                <SearchBar query={query} onQueryChange={onQueryChange} />
            </div>
        </section>
    );
}

function SearchBar({
    query,
    onQueryChange,
}: {
    query: string;
    onQueryChange: (value: string) => void;
}) {
    return (
        <div className="flex flex-col items-center w-full">
            <form
                className="flex flex-col gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-md sm:flex-row w-full"
                onSubmit={(event) => event.preventDefault()}
            >
                <label className="sr-only" htmlFor="tool-search">
                    Search tools
                </label>
                <input
                    id="tool-search"
                    type="search"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Search for a category or tool (e.g. PDF, JSON, Base64)"
                    className="h-12 flex-1 rounded-2xl border border-transparent bg-transparent px-4 text-base outline-none placeholder:text-[var(--muted)] focus:border-[var(--border-strong)]"
                />
                <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white"
                >
                    Search
                </button>
            </form>
            <p className="mt-3 text-xs text-[var(--muted)]">
                Try searching for <span className="font-medium text-[var(--foreground)]">PDF</span>, <span className="font-medium text-[var(--foreground)]">JSON</span>, or <span className="font-medium text-[var(--foreground)]">Base64</span>
            </p>
        </div>
    );
}

function StatsRow() {
    return (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-soft)] backdrop-blur text-center"
                >
                    <p className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{stat.value}</p>
                    <p className="mt-1 text-xs text-[var(--muted)] font-medium">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}

function SectionBlock({
    eyebrow,
    title,
    description,
    id,
    children,
}: {
    eyebrow: string;
    title: string;
    description: string;
    id?: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-28">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            {children}
        </section>
    );
}

function SectionHeading({
    eyebrow,
    title,
    description,
    id,
}: {
    eyebrow: string;
    title: string;
    description: string;
    id?: string;
}) {
    return (
        <div className="mb-6 max-w-3xl" id={id}>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                {eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                {title}
            </h2>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">{description}</p>
        </div>
    );
}

function CategoryCard({
    category,
    count,
    onSelect,
}: {
    category: ToolCategoryMeta;
    count: number;
    onSelect: (value: string) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onSelect(category.name)}
            className="group flex h-full flex-col rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-5 text-left shadow-[var(--shadow-soft)] backdrop-blur transition-transform hover:-translate-y-1 hover:border-[var(--border-strong)]"
        >
            <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.tone} border border-[var(--border)]`}
            >
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground)]">
                    {category.name.slice(0, 2)}
                </span>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">{category.name}</h3>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                    {count} tools
                </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{category.description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                Explore category
                <ArrowIcon />
            </span>
        </button>
    );
}



function EmptyState({ label }: { label: string }) {
    return (
        <div className="mt-4 rounded-[1.5rem] border border-dashed border-[var(--border)] bg-[var(--card)] px-5 py-6 text-sm text-[var(--muted)]">
            {label}
        </div>
    );
}

function ArrowIcon() {
    return <MiniIcon path="M5 12h14M13 5l7 7-7 7" />;
}



function MiniIcon({ path }: { path: string }) {
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
            <path d={path} />
        </svg>
    );
}