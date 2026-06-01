"use client";

import type { ReactNode } from "react";
import { useState, useSyncExternalStore } from "react";
import { ToolCard as RegistryToolCard } from "@/components/tool-card";
import { searchTools, toolCategories, tools, type ToolCategoryMeta } from "@/data/tools";

type ThemeMode = "light" | "dark";

type Feature = {
    title: string;
    description: string;
    stat: string;
    icon: ReactNode;
};

type FaqItem = {
    question: string;
    answer: string;
};

const storageKey = "partha-tools-theme";

function getThemeFromStorage(): ThemeMode {
    if (typeof window === "undefined") {
        return "light";
    }

    const storedTheme = window.localStorage.getItem(storageKey);
    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getThemeSnapshot(): ThemeMode {
    if (typeof document === "undefined") {
        return "light";
    }

    const currentTheme = document.documentElement.dataset.theme;
    if (currentTheme === "light" || currentTheme === "dark") {
        return currentTheme;
    }

    return getThemeFromStorage();
}

function subscribeToTheme(listener: () => void) {
    window.addEventListener("storage", listener);
    window.addEventListener("partha-themechange", listener as EventListener);

    return () => {
        window.removeEventListener("storage", listener);
        window.removeEventListener("partha-themechange", listener as EventListener);
    };
}

function setTheme(nextTheme: ThemeMode) {
    if (typeof window === "undefined") {
        return;
    }

    const root = document.documentElement;
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    window.localStorage.setItem(storageKey, nextTheme);
    window.dispatchEvent(new Event("partha-themechange"));
}

const features: Feature[] = [
    {
        title: "Search first workflow",
        description:
            "Filter categories and tools as you type, so the right utility is never buried.",
        stat: "Sub-second discovery",
        icon: <SparkIcon />,
    },
    {
        title: "Built for dark and light mode",
        description:
            "The entire interface adapts to the user's preference without losing contrast.",
        stat: "System aware",
        icon: <MoonSunIcon />,
    },
    {
        title: "Reusable UI blocks",
        description:
            "Cards, sections, and controls are composed from small, focused components.",
        stat: "Composable",
        icon: <LayersIcon />,
    },
];

const faqs: FaqItem[] = [
    {
        question: "Is ParthaTools responsive on mobile devices?",
        answer:
            "Yes. The layout uses flexible grids, adaptive spacing, and touch-friendly controls so it works cleanly across phone, tablet, and desktop screens.",
    },
    {
        question: "Does the homepage include a real dark mode toggle?",
        answer:
            "Yes. The toggle stores the selected theme in localStorage and respects the user's system preference on first visit.",
    },
    {
        question: "Can the search bar actually do anything?",
        answer:
            "Yes. It filters the categories and popular tools in place, making the landing page immediately useful instead of decorative.",
    },
    {
        question: "Is this built with reusable components?",
        answer:
            "Yes. The hero, section headers, cards, toggle, and FAQ items are separated into composable pieces inside the homepage module.",
    },
];

const stats = [
    { value: `${tools.length}`, label: "utility tools" },
    { value: `${toolCategories.length}`, label: "tool categories" },
    { value: "100%", label: "responsive coverage" },
];

export function HomePage() {
    const theme = useSyncExternalStore<ThemeMode>(subscribeToTheme, getThemeSnapshot, () => "light");
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
            <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.14),transparent_28%)]" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pb-24">
                <Header theme={theme} onThemeToggle={setTheme} />
                <Hero query={query} onQueryChange={setQuery} />
                <StatsRow />
                <SectionBlock
                    id="categories"
                    eyebrow="Browse by category"
                    title="All the utility buckets you expect, styled like a modern product launch"
                    description="Move from broad intent to specific tools without leaving the homepage."
                >
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
                    eyebrow="Popular tools"
                    title="Frequently used utilities, ready to surface fast"
                    description="These tools represent the highest-frequency tasks people usually need first."
                >
                    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        {filteredTools.map((tool) => (
                            <RegistryToolCard key={tool.slug} tool={tool} />
                        ))}
                    </div>
                    {filteredTools.length === 0 ? <EmptyState label="No tools matched your search." /> : null}
                </SectionBlock>

                <SectionBlock
                    eyebrow="Why it works"
                    title="Feature cards built for a polished SaaS homepage"
                    description="A focused, benefits-first layout keeps the utility brand crisp and easy to scan."
                >
                    <div className="grid gap-4 lg:grid-cols-3">
                        {features.map((feature) => (
                            <FeatureCard key={feature.title} feature={feature} />
                        ))}
                    </div>
                </SectionBlock>

                <SectionBlock
                    id="faq"
                    eyebrow="FAQ"
                    title="Common questions, answered"
                    description="These details help the homepage feel complete without turning into filler."
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        {faqs.map((faq) => (
                            <FaqCard key={faq.question} faq={faq} />
                        ))}
                    </div>
                </SectionBlock>

                <Footer />
            </div>
        </main>
    );
}

function Header({
    theme,
    onThemeToggle,
}: {
    theme: ThemeMode;
    onThemeToggle: (nextTheme: ThemeMode) => void;
}) {
    return (
        <header className="sticky top-4 z-20 rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)]/90 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:px-5">
            <div className="flex items-center justify-between gap-4">
                <a href="#top" className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,94,239,0.3)]">
                        PT
                    </div>
                    <div>
                        <p className="text-sm font-semibold tracking-[0.24em] uppercase text-[var(--muted)]">
                            ParthaTools
                        </p>
                        <p className="text-xs text-[var(--muted)]">Utility tools, refined</p>
                    </div>
                </a>

                <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
                    <a href="#categories" className="transition-colors hover:text-[var(--foreground)]">
                        Categories
                    </a>
                    <a href="#popular-tools" className="transition-colors hover:text-[var(--foreground)]">
                        Popular tools
                    </a>
                    <a href="#faq" className="transition-colors hover:text-[var(--foreground)]">
                        FAQ
                    </a>
                </nav>

                <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            </div>
        </header>
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
        <section id="top" className="grid items-center gap-8 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:pt-14">
            <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted)] shadow-[var(--shadow-soft)] backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                    Modern utility homepage for developers and creators
                </div>

                <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-7xl">
                    Find the right utility tool in a homepage that feels fast, polished, and intentional.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                    ParthaTools brings developer utilities, document helpers, image workflows, and text tooling into one SaaS-style landing page with search, categories, and a clear dark mode experience.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <a
                        href="#categories"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.28)] transition-transform hover:-translate-y-0.5"
                    >
                        Explore categories
                    </a>
                    <a
                        href="#popular-tools"
                        className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--card)] px-6 text-sm font-semibold text-[var(--foreground)] backdrop-blur transition-transform hover:-translate-y-0.5"
                    >
                        View popular tools
                    </a>
                </div>

                <SearchBar query={query} onQueryChange={onQueryChange} />
            </div>

            <div className="relative">
                <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(21,94,239,0.22),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_36%)] blur-2xl" />
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent)] p-5">
                            <p className="text-sm text-[var(--muted)]">Search activity</p>
                            <p className="mt-3 text-3xl font-semibold">Real-time</p>
                            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                Instant category and tool filtering with no page reload.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent)] p-5">
                            <p className="text-sm text-[var(--muted)]">Theme support</p>
                            <p className="mt-3 text-3xl font-semibold">Light + Dark</p>
                            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                A system-aware toggle persists the preferred mode.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-3xl border border-[var(--border)] bg-[var(--background)]/70 p-5">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                                    Live query
                                </p>
                                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                                    {query || "Try 'PDF', 'JSON', or 'image'"}
                                </p>
                            </div>
                            <div className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-semibold text-[var(--muted)]">
                                Search filters below
                            </div>
                        </div>
                    </div>
                </div>
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
        <form
            className="mt-8 flex flex-col gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-md sm:flex-row"
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
                placeholder="Search for a category or tool"
                className="h-12 flex-1 rounded-2xl border border-transparent bg-transparent px-4 text-base outline-none placeholder:text-[var(--muted)] focus:border-[var(--border-strong)]"
            />
            <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white"
            >
                Search
            </button>
        </form>
    );
}

function StatsRow() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur"
                >
                    <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{stat.label}</p>
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
}: {
    eyebrow: string;
    title: string;
    description: string;
}) {
    return (
        <div className="mb-6 max-w-3xl">
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

function FeatureCard({ feature }: { feature: Feature }) {
    return (
        <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                {feature.icon}
            </div>
            <h3 className="mt-5 text-lg font-semibold text-[var(--foreground)]">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{feature.description}</p>
            <div className="mt-5 inline-flex rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                {feature.stat}
            </div>
        </article>
    );
}

function FaqCard({ faq }: { faq: FaqItem }) {
    return (
        <details className="group rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-[var(--foreground)]">
                {faq.question}
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-transform group-open:rotate-45">
                    <PlusIcon />
                </span>
            </summary>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">{faq.answer}</p>
        </details>
    );
}

function Footer() {
    return (
        <footer className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] px-6 py-8 shadow-[var(--shadow-soft)] backdrop-blur">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                        ParthaTools
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                        A utility homepage that looks and feels like a modern product.
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                        Built with reusable React components, App Router conventions, and a design system that holds up in both light and dark mode.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[var(--muted)]">
                    <a
                        href="#categories"
                        className="rounded-full border border-[var(--border)] px-4 py-2 transition-colors hover:text-[var(--foreground)]"
                    >
                        Categories
                    </a>
                    <a
                        href="#popular-tools"
                        className="rounded-full border border-[var(--border)] px-4 py-2 transition-colors hover:text-[var(--foreground)]"
                    >
                        Popular tools
                    </a>
                    <a
                        href="#faq"
                        className="rounded-full border border-[var(--border)] px-4 py-2 transition-colors hover:text-[var(--foreground)]"
                    >
                        FAQ
                    </a>
                </div>
            </div>
        </footer>
    );
}

function ThemeToggle({
    theme,
    onToggle,
}: {
    theme: ThemeMode;
    onToggle: (nextTheme: ThemeMode) => void;
}) {
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={() => onToggle(isDark ? "light" : "dark")}
            className="inline-flex h-11 items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
            aria-label="Toggle color theme"
        >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--card)] text-[var(--accent)] shadow-[var(--shadow-soft)]">
                {isDark ? <MoonIcon /> : <SunIcon />}
            </span>
            <span className="hidden sm:inline">{isDark ? "Dark" : "Light"} mode</span>
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

function SparkIcon() {
    return <MiniIcon path="M12 3 9 9 3 12l6 3 3 6 3-6 6-3-6-3-3-6z" />;
}

function MoonSunIcon() {
    return <MiniIcon path="M20 12.5A7.5 7.5 0 1 1 11.5 4a6.5 6.5 0 1 0 8.5 8.5z" />;
}

function LayersIcon() {
    return <MiniIcon path="M12 4 4 8l8 4 8-4-8-4zm0 8-8 4 8 4 8-4-8-4z" />;
}

function ArrowIcon() {
    return <MiniIcon path="M5 12h14M13 5l7 7-7 7" />;
}

function PlusIcon() {
    return <MiniIcon path="M12 6v12M6 12h12" />;
}

function SunIcon() {
    return <MiniIcon path="M12 3v3m0 12v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M3 12h3m12 0h3M4.2 19.8l2.1-2.1m11.4-11.4 2.1-2.1M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />;
}

function MoonIcon() {
    return <MiniIcon path="M18 13.5A7.5 7.5 0 0 1 10.5 6c0-.7.1-1.4.3-2A8 8 0 1 0 20 15.2c-.8-.5-1.6-1.1-2-1.7z" />;
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