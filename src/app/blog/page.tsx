import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Developer Blog | ParthaTools",
  description: "Deep dive technical articles on JSON formatting, web utilities, cryptographic safety, PDF compression protocols, and secure browser-based tools.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Developer Blog | ParthaTools",
    description: "Deep dive technical articles on JSON formatting, web utilities, cryptographic safety, PDF compression protocols, and secure browser-based tools.",
    url: "https://www.parthatools.me/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Blog | ParthaTools",
    description: "Deep dive technical articles on JSON formatting, web utilities, cryptographic safety, PDF compression protocols, and secure browser-based tools.",
  },
};

export default function BlogIndexPage() {
  return (
    <main className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.14),transparent_28%)]" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pb-20">
        <Header />

        {/* Hero Header */}
        <section className="flex flex-col items-center text-center pt-8 pb-4 max-w-3xl mx-auto w-full">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--accent)] font-semibold shadow-[var(--shadow-soft)] backdrop-blur">
            Articles & Documentation
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
            The ParthaTools Engineering Blog
          </h1>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            Explore comprehensive guides and deep dives explaining web protocols, local cryptography, browser-based sandboxes, and file manipulation algorithms.
          </p>
        </section>

        {/* Blog Post Grid */}
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)]"
            >
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 font-semibold text-[var(--accent)]">
                  {post.category}
                </span>
                <span className="text-[var(--muted)]">{post.readTime}</span>
              </div>

              <h2 className="mt-4 text-xl font-bold leading-7 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">
                {post.excerpt}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
                <span className="text-xs text-[var(--muted)]">{post.date}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline"
                >
                  Read Article
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </section>

        <Footer />
      </div>
    </main>
  );
}
