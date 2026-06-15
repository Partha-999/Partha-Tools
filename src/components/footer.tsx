"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-soft)] backdrop-blur">
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="max-w-md">
                    <Link href="/" className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]">
                        ParthaTools
                    </Link>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                        Fast, secure, browser-based utilities
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                        ParthaTools is a curated collection of lightweight tools for developers and content creators. All utilities execute entirely within your browser to keep your data private.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:justify-items-end">
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">Utilities</p>
                        <Link href="/#categories" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                            Categories
                        </Link>
                        <Link href="/#popular-tools" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                            All Tools
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">Company</p>
                        <Link href="/about" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                            Contact
                        </Link>
                        <Link href="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                            Blog
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">Legal</p>
                        <Link href="/privacy-policy" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
                <p>© {new Date().getFullYear()} ParthaTools. All rights reserved.</p>
                <p>100% private, client-side execution.</p>
            </div>
        </footer>
    );
}
