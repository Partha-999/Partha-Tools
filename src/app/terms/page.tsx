import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Read the ParthaTools Terms of Service. Review the conditions and rules for using our browser-based utility tools.",
    alternates: {
        canonical: "/terms",
    },
    openGraph: {
        title: "Terms of Service | ParthaTools",
        description: "Read the ParthaTools Terms of Service. Review the conditions and rules for using our browser-based utility tools.",
        url: "https://parthatools.me/terms",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Terms of Service | ParthaTools",
        description: "Read the ParthaTools Terms of Service. Review the conditions and rules for using our browser-based utility tools.",
    },
};

export default function TermsPage() {
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
                        Terms of Service
                    </h1>

                    <p className="mt-4 text-base leading-7 text-[var(--muted)] sm:text-lg">
                        Please read these terms of service carefully before using the ParthaTools platform.
                    </p>
                </section>

                <section className="max-w-4xl mx-auto w-full rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 sm:p-8 shadow-[var(--shadow)] backdrop-blur-xl flex flex-col gap-8">
                    <div>
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">1. Acceptance of Terms</h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            By accessing and using ParthaTools (&quot;the Website&quot;, &quot;the Service&quot;), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </div>

                    <div className="border-t border-[var(--border)] pt-8">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">2. License & Use of Services</h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            ParthaTools grants you a personal, non-exclusive, non-transferable, and revocable license to use our client-side utility tools for personal or professional tasks.
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                            You agree not to attempt to disrupt or interfere with the security or performance of the Website or copy our code for unauthorized distribution.
                        </p>
                    </div>

                    <div className="border-t border-[var(--border)] pt-8">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">3. Disclaimer of Warranties</h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            The Website and its utilities are provided on an &quot;as is&quot; and &quot;as available&quot; basis. ParthaTools makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                            Further, ParthaTools does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials or tools on its Website.
                        </p>
                    </div>

                    <div className="border-t border-[var(--border)] pt-8">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">4. Limitations of Liability</h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            In no event shall ParthaTools or its creators be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the tools on ParthaTools, even if ParthaTools or an authorized representative has been notified orally or in writing of the possibility of such damage.
                        </p>
                    </div>

                    <div className="border-t border-[var(--border)] pt-8">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">5. Accuracy of Tools & Materials</h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            The tools and materials appearing on ParthaTools could include technical, typographical, or photographic errors. ParthaTools does not promise that any of the materials on its Website are accurate, complete, or current. We may make changes to the tools or materials contained on the Website at any time without notice.
                        </p>
                    </div>

                    <div className="border-t border-[var(--border)] pt-8">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">6. Governing Law</h2>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction of the website operators, without giving effect to any principles of conflicts of law.
                        </p>
                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
