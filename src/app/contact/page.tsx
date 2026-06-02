import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with ParthaTools for support, feedback, or developer tool inquiries.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact Us | ParthaTools",
        description: "Get in touch with ParthaTools for support, feedback, or developer tool inquiries.",
        url: "https://parthatools.me/contact",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Us | ParthaTools",
        description: "Get in touch with ParthaTools for support, feedback, or developer tool inquiries.",
    },
};

export default function ContactPage() {
    return (
        <main className="relative overflow-hidden min-h-screen flex flex-col justify-between">
            <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.14),transparent_28%)]" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pb-20 flex-1">
                <Header />

                <section className="flex flex-col items-center text-center pt-8 pb-4 max-w-3xl mx-auto w-full">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--muted)] shadow-[var(--shadow-soft)] backdrop-blur mb-5">
                        <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
                        Get in Touch
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
                        Contact Us
                    </h1>

                    <p className="mt-4 text-base leading-7 text-[var(--muted)] sm:text-lg">
                        Have a feature suggestion, found a bug, or just want to say hi? Send us a message!
                    </p>
                </section>

                <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start max-w-5xl mx-auto w-full">
                    <ContactForm />

                    <div className="flex flex-col gap-6 w-full">
                        <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] backdrop-blur">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-[var(--border)] mb-5">
                                <svg className="h-6 w-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--foreground)]">Direct Email</h3>
                            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                Feel free to email us directly for partnerships, questions, or issues.
                            </p>
                            <a href="mailto:support@parthatools.dev" className="mt-4 inline-block text-sm font-semibold text-[var(--accent)] hover:underline">
                                support@parthatools.dev
                            </a>
                        </div>

                        <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] backdrop-blur">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-400/10 border border-[var(--border)] mb-5">
                                <svg className="h-6 w-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--foreground)]">Open Source</h3>
                            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                ParthaTools is fully open source. You can report bugs or open pull requests directly on our repository.
                            </p>
                            <a href="https://github.com/partha-tools/partha-tools" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-[var(--accent)] hover:underline">
                                GitHub Repository →
                            </a>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
