import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Read the ParthaTools Privacy Policy. Learn how we guarantee complete security through 100% client-side data execution.",
    alternates: {
        canonical: "/privacy-policy",
    },
    openGraph: {
        title: "Privacy Policy | ParthaTools",
        description: "Read the ParthaTools Privacy Policy. Learn how we guarantee complete security through 100% client-side data execution.",
        url: "https://www.parthatools.me/privacy-policy",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Privacy Policy | ParthaTools",
        description: "Read the ParthaTools Privacy Policy. Learn how we guarantee complete security through 100% client-side data execution.",
    },
};

export default function PrivacyPolicyPage() {
    return (
        <main className="relative overflow-hidden min-h-screen flex flex-col justify-between">
            <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.14),transparent_28%)]" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pb-20 flex-1">
                <Header />

                <section className="flex flex-col items-center text-center pt-8 pb-4 max-w-3xl mx-auto w-full">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--muted)] shadow-[var(--shadow-soft)] backdrop-blur mb-5">
                        <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
                        Effective Date: June 2, 2026
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
                        Privacy Policy
                    </h1>

                    <p className="mt-4 text-base leading-7 text-[var(--muted)] sm:text-lg">
                        At ParthaTools, we believe your data belongs to you. Here is how we guarantee absolute privacy.
                    </p>
                </section>

                <section className="max-w-4xl mx-auto w-full rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 sm:p-8 shadow-[var(--shadow)] backdrop-blur-xl flex flex-col gap-8">
                    <div>
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">1. Complete Client-Side Processing</h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            All calculations, document formatting, string conversions, QR generation, PDF manipulations, and utility actions are performed entirely on your device using client-side JavaScript. <strong>We do not run backend application servers, and we never transmit your input data or files to any external server.</strong>
                        </p>
                    </div>

                    <div className="border-t border-[var(--border)] pt-8">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">2. No Analytics & Cookies</h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            ParthaTools does not use tracking cookies, beacons, or analytics scripts (such as Google Analytics). Your visits and interactions are fully private and untracked.
                        </p>
                    </div>

                    <div className="border-t border-[var(--border)] pt-8">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">3. Local Theme Settings</h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            We utilize the browser&apos;s <code>localStorage</code> API solely to store your light or dark mode theme selection. This configuration is stored locally on your device, is never sent to any server, and can be cleared using your browser settings at any time.
                        </p>
                    </div>

                    <div className="border-t border-[var(--border)] pt-8">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">4. Third-Party Websites</h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            Our platform may contain links to external sites (such as GitHub). If you click on a third-party link, you will be directed to that site. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                        </p>
                    </div>

                    <div className="border-t border-[var(--border)] pt-8">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">5. Changes to This Privacy Policy</h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;effective date&quot; at the top of this policy.
                        </p>
                    </div>

                    <div className="border-t border-[var(--border)] pt-8">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">6. Contact Us</h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
                        </p>
                        <a href="mailto:privacy@parthatools.me" className="mt-3 inline-block text-sm font-semibold text-[var(--accent)] hover:underline">
                            privacy@parthatools.me
                        </a>
                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
