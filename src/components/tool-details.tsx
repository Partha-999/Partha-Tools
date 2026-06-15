"use client";

import { useState } from "react";
import { toolArticles } from "@/data/tool-content";
import { getToolBySlug, tools } from "@/data/tools";
import { ToolCard } from "@/components/tool-card";

interface ToolDetailsProps {
  slug: string;
}

export function ToolDetails({ slug }: ToolDetailsProps) {
  const article = toolArticles[slug];
  const tool = getToolBySlug(slug);

  // FAQ Accordion state
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

  if (!article || !tool) {
    return null;
  }

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Find related tools (excluding the current one, in the same category)
  const relatedTools = tools
    .filter((t) => t.category === tool.category && t.slug !== slug)
    .slice(0, 3); // show up to 3 related tools

  return (
    <section className="mt-16 w-full space-y-16 border-t border-[var(--border)] pt-16">
      {/* Intro Header */}
      <div className="max-w-3xl">
        <span className="inline-flex items-center rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
          Detailed Technical Guide
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Everything You Need to Know About {tool.name}
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          Learn how to use our client-side {tool.name} tool efficiently, understand the technical concepts, and explore FAQs.
        </p>
      </div>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main Content Areas */}
        <div className="space-y-12 lg:col-span-2">
          {/* What is and Why use */}
          <div className="space-y-8">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <h3 className="text-xl font-semibold text-[var(--foreground)]">What is {tool.name}?</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)] whitespace-pre-line">
                {article.whatIs}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <h3 className="text-xl font-semibold text-[var(--foreground)]">Why use {tool.name}?</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)] whitespace-pre-line">
                {article.whyUse}
              </p>
            </div>
          </div>

          {/* How to use */}
          {/*
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <h3 className="text-xl font-semibold text-[var(--foreground)]">How to Use {tool.name} Step-by-Step</h3>
            <ol className="mt-6 space-y-4">
              {article.howToUse.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white">
                    {idx + 1}
                  </span>
                  <p className="text-sm leading-6 text-[var(--muted)]">{step}</p>
                </li>
              ))}
            </ol>
          </div> */}

          {/* Examples */}
          {/*
          {article.examples && article.examples.length > 0 && (
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <h3 className="text-xl font-semibold text-[var(--foreground)]">Code & Format Examples</h3>
              <div className="mt-6 space-y-6">
                {article.examples.map((example, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">{example.title}</h4>
                    <p className="text-sm leading-relaxed text-[var(--muted)]">{example.description}</p>
                    {example.code && (
                      <pre className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs text-[var(--foreground)] leading-5">
                        <code>{example.code}</code>
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          */}
          {/* Privacy & Sandbox Callout */}
          <div className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                  Privacy & Client-Side Sandbox Guarantee
                </h3>
                <p className="mt-3 text-sm leading-6 text-emerald-700/80 dark:text-emerald-400/90">
                  {article.privacy}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-8">
          {/* Key Features Column */}
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Key Features</h3>
            <ul className="mt-6 space-y-4">
              {article.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p className="text-sm leading-5 text-[var(--muted)]">{feature}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Use Cases */}
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Common Use Cases</h3>
            <ul className="mt-6 space-y-4">
              {article.useCases.map((useCase, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <p className="text-sm leading-5 text-[var(--muted)]">{useCase}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-3xl border-t border-[var(--border)] pt-12">
        <h3 className="text-2xl font-bold text-[var(--foreground)]">Frequently Asked Questions</h3>
        <div className="mt-8 space-y-4">
          {article.faqs.map((faq, idx) => {
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

      {/* Related Tools Section */}
      {relatedTools.length > 0 && (
        <div className="border-t border-[var(--border)] pt-12">
          <h3 className="text-2xl font-bold text-[var(--foreground)]">Related Utilities</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Explore other browser-based tools in the {tool.category} category.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((rTool) => (
              <ToolCard key={rTool.id} tool={rTool} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
