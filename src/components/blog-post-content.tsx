"use client";

import { useState } from "react";
import Link from "next/link";
import { BlogPost } from "@/data/blog-posts";
import { getToolBySlug } from "@/data/tools";
import { ToolCard } from "@/components/tool-card";

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Resolve related tools details
  const relatedToolsData = post.relatedTools
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is typeof t & {} => !!t);

  return (
    <article className="mx-auto w-full max-w-5xl space-y-12 py-8">
      {/* Back button */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <span>←</span> Back to all articles
        </Link>
      </div>

      {/* Header Info */}
      <header className="space-y-4">
        <div className="flex items-center gap-4 text-xs">
          <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 font-semibold text-[var(--accent)]">
            {post.category}
          </span>
          <span className="text-[var(--muted)]">{post.readTime}</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
          {post.title}
        </h1>
        <p className="text-xs text-[var(--muted)]">Published on {post.date}</p>
      </header>

      {/* Sidebar + Main Content Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Table of Contents Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
              Table of Contents
            </h3>
            <nav className="flex flex-col gap-3">
              {post.toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors hover:underline"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Article content */}
        <div className="lg:col-span-2 space-y-8">
          <div
            className="prose prose-invert max-w-none text-sm leading-7 text-[var(--muted)] space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Interactive FAQs Accordion */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="border-t border-[var(--border)] pt-8 space-y-6">
              <h3 className="text-2xl font-bold text-[var(--foreground)]">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {post.faqs.map((faq, idx) => {
                  const isOpen = !!openFaqs[idx];
                  return (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="flex w-full items-center justify-between p-5 text-left font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--accent-soft)]"
                      >
                        <span className="text-base">{faq.question}</span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`h-5 w-5 shrink-0 text-[var(--muted)] transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      <div
                        className={`transition-all duration-200 ease-in-out ${
                          isOpen ? "max-h-96 border-t border-[var(--border)] p-5" : "max-h-0"
                        }`}
                        style={{
                          visibility: isOpen ? "visible" : "hidden",
                        }}
                      >
                        <p className="text-sm leading-6 text-[var(--muted)] whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Related Tools Links */}
          {relatedToolsData.length > 0 && (
            <div className="border-t border-[var(--border)] pt-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-[var(--foreground)]">
                  Launch Related Utility Tools
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Execute secure client-side conversions and formatting tasks using our related browser apps.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedToolsData.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
