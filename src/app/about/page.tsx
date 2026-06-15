import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn more about ParthaTools, our privacy-first philosophy, and browser-based developer utilities.",
    alternates: {
        canonical: "/about",
    },
    openGraph: {
        title: "About Us | ParthaTools",
        description: "Learn more about ParthaTools, our privacy-first philosophy, and browser-based developer utilities.",
        url: "https://www.parthatools.me/about",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us | ParthaTools",
        description: "Learn more about ParthaTools, our privacy-first philosophy, and browser-based developer utilities.",
    },
};

export default function AboutPage() {
    return (
        <main className="relative overflow-hidden min-h-screen flex flex-col justify-between">
            <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.14),transparent_28%)]" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pb-20 flex-1">
                <Header />

                <section className="flex flex-col items-center text-center pt-8 pb-4 max-w-3xl mx-auto w-full">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--muted)] shadow-[var(--shadow-soft)] backdrop-blur mb-5">
                        <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
                        Our Mission & Philosophy
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
                        About ParthaTools
                    </h1>

                    <p className="mt-4 text-base leading-7 text-[var(--muted)] sm:text-lg">
                        A curated repository of client-side developer, text, PDF, and web utilities. Refined, fast, and engineered with absolute privacy in mind.
                    </p>
                </section>

                <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] backdrop-blur">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-[var(--border)] mb-5">
                            <svg className="h-6 w-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--foreground)]">Absolute Privacy</h3>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            All processing is done entirely client-side using JavaScript in your browser. No files, text snippets, tokens, or payloads are ever uploaded to a server.
                        </p>
                    </div>

                    <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] backdrop-blur">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-400/10 border border-[var(--border)] mb-5">
                            <svg className="h-6 w-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--foreground)]">Zero Delay</h3>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            Without backend network requests, our utilities execute instantly. Format JSON, decode Base64, generate QR codes, or merge PDFs without lag.
                        </p>
                    </div>

                    <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] backdrop-blur text-left">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-400/10 border border-[var(--border)] mb-5">
                            <svg className="h-6 w-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--foreground)]">Clean Experience</h3>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            No signup popups, cookie walls, or persistent advertisements. ParthaTools is created to be a fast utility workspace for immediate day-to-day work.
                        </p>
                    </div>
                </section>

                <section className="grid gap-8 lg:grid-cols-3">
                    {/* Sandbox Security Mechanics */}
                    <div className="lg:col-span-2 rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-8 shadow-[var(--shadow)] backdrop-blur-xl space-y-6">
                        <h2 className="text-2xl font-bold text-[var(--foreground)]">Technical Sandbox & Security Architecture</h2>
                        <p className="text-sm leading-7 text-[var(--muted)]">
                            ParthaTools operates on a zero-trust architecture. When you upload a file or paste standard payloads into our tools, all operations are isolated within the browser&apos;s client-side memory context. Our codebase implements native browser capabilities, local JavaScript arrays, and secure compiled WebAssembly tools.
                        </p>
                        <p className="text-sm leading-7 text-[var(--muted)]">
                            Because there is no communication with back-end databases, the processing environment is bounded by the browser&apos;s V8 engine sandboxing. This limits memory allocations dynamically and guarantees that data structures—including certificates, personal files, and authorization keys—cannot be read by external scripts or stored on cloud drives. It remains completely protected within transient runtime heap storage.
                        </p>
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs text-[var(--foreground)]">
                            <span className="text-[var(--accent)]">{"// Client-Side Process Isolation Verification"}</span><br />
                            const processLocally = (inputData) =&gt; &#123;<br />
                            &nbsp;&nbsp;console.log(&quot;Processing payload locally...&quot;);<br />
                            &nbsp;&nbsp;<span className="text-[var(--accent)]">{"// Executed purely in transient heap memory"}</span><br />
                            &nbsp;&nbsp;return sandboxCompile(inputData);<br />
                            &#125;;
                        </div>
                    </div>

                    {/* Founder & Project Bio */}
                    <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-soft)] backdrop-blur-xl flex flex-col justify-between">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[var(--foreground)]">Founder Story</h2>
                            <p className="text-sm leading-6 text-[var(--muted)]">
                                ParthaTools was founded by Partha, a developer seeking a simpler, faster, and more private alternative to bloated online converters.
                            </p>
                            <p className="text-sm leading-6 text-[var(--muted)]">
                                Frustrated by tools with subscription traps, tracking scripts, and server-side processing, Partha created these utilities to provide developers with a clean sandbox environment.
                            </p>
                        </div>
                        <div className="mt-8 border-t border-[var(--border)] pt-6">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Open Source Codebase</p>
                            <a
                                href="https://github.com/partha-999/partha-tools"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"
                            >
                                Verify on GitHub
                                <span>→</span>
                            </a>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
