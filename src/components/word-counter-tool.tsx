"use client";

import { useMemo, useState } from "react";

const starterInput = "ParthaTools is a collection of high-quality developer utilities. It includes tools for JSON formatting, Base64 encoding/decoding, QR code generation, password generation, and much more. Start typing your text here to see real-time statistics like word count, character count, and reading time. Word counters are useful for bloggers, writers, students, and engineers alike.";

export function WordCounterTool() {
    const [input, setInput] = useState(starterInput);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const stats = useMemo(() => {
        const text = input || "";
        const cleanText = text.trim();
        
        // Word count
        const wordsArray = cleanText === "" ? [] : cleanText.split(/\s+/);
        const wordCount = wordsArray.length;
        
        // Character counts
        const charCountWithSpaces = text.length;
        const charCountWithoutSpaces = text.replace(/\s/g, "").length;

        // Sentence count
        const sentenceCount = cleanText === "" ? 0 : cleanText.split(/[.!?]+/).filter((s) => s.trim() !== "").length;

        // Paragraph count
        const paragraphCount = cleanText === "" ? 0 : cleanText.split(/\n+/).filter((p) => p.trim() !== "").length;

        // Reading time (~200 words per minute)
        const readingTimeSeconds = Math.round((wordCount / 200) * 60);
        const readingTime = readingTimeSeconds < 60 
            ? `${readingTimeSeconds} sec`
            : `${Math.ceil(readingTimeSeconds / 60)} min`;

        // Speaking time (~130 words per minute)
        const speakingTimeSeconds = Math.round((wordCount / 130) * 60);
        const speakingTime = speakingTimeSeconds < 60
            ? `${speakingTimeSeconds} sec`
            : `${Math.ceil(speakingTimeSeconds / 60)} min`;

        // Keyword Density
        const wordFrequency: Record<string, number> = {};
        wordsArray.forEach((w) => {
            const cleanWord = w.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
            if (cleanWord.length > 2) {
                wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
            }
        });

        const sortedKeywords = Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([word, count]) => ({
                word,
                count,
                percentage: wordCount > 0 ? Math.round((count / wordCount) * 100) : 0,
            }));

        return {
            wordCount,
            charCountWithSpaces,
            charCountWithoutSpaces,
            sentenceCount,
            paragraphCount,
            readingTime,
            speakingTime,
            keywords: sortedKeywords,
        };
    }, [input]);

    async function handleCopy() {
        if (!input) {
            setError("Nothing to copy yet. Provide some text first.");
            return;
        }

        try {
            await navigator.clipboard.writeText(input);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
            setError("");
        } catch {
            setError("Copy failed. Your browser may have blocked clipboard access.");
        }
    }

    function handleClear() {
        setInput("");
        setError("");
        setCopied(false);
    }

    return (
        <div className="flex flex-col gap-10">
            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                                Word Counter
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                                Analyze your text metrics in real-time.
                            </h2>
                        </div>
                    </div>

                    <label className="mt-6 block text-sm font-semibold text-[var(--foreground)]" htmlFor="word-counter-input">
                        Input text area
                    </label>
                    <textarea
                        id="word-counter-input"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Type or paste your content here..."
                        className="mt-3 min-h-[22rem] w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/85 px-4 py-4 text-sm leading-7 text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--border-strong)]"
                        spellCheck={true}
                    />

                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,94,239,0.24)] transition-transform hover:-translate-y-0.5"
                        >
                            {copied ? "Copied text" : "Copy text"}
                        </button>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-transparent px-5 text-sm font-semibold text-[var(--muted)] transition-transform hover:-translate-y-0.5 hover:text-[var(--foreground)]"
                        >
                            Clear
                        </button>
                    </div>

                    {error ? (
                        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                            {error}
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-col gap-6">
                    <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            Key Metrics
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                            Real-time Statistics
                        </h3>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <MetricCard label="Words" value={stats.wordCount} />
                            <MetricCard label="Characters" value={stats.charCountWithSpaces} />
                            <MetricCard label="Chars (no spaces)" value={stats.charCountWithoutSpaces} />
                            <MetricCard label="Paragraphs" value={stats.paragraphCount} />
                            <MetricCard label="Sentences" value={stats.sentenceCount} />
                            <MetricCard label="Reading Time" value={stats.readingTime} />
                            <MetricCard label="Speaking Time" value={stats.speakingTime} />
                        </div>
                    </div>

                    <div className="flex-1 rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                            Keyword Density
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                            Top word frequencies (&gt;2 letters)
                        </h3>

                        {stats.keywords.length === 0 ? (
                            <p className="mt-5 text-sm text-[var(--muted)]">No word counts calculated yet. Start typing to show keyword density.</p>
                        ) : (
                            <div className="mt-5 space-y-3.5">
                                {stats.keywords.map((kw) => (
                                    <div key={kw.word} className="flex flex-col gap-1.5 text-sm">
                                        <div className="flex items-center justify-between font-medium">
                                            <span className="font-mono text-[var(--foreground)]">{kw.word}</span>
                                            <span className="text-[var(--muted)]">
                                                {kw.count} ({kw.percentage}%)
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-[var(--background)] overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--accent)] transition-all duration-300"
                                                style={{ width: `${kw.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <hr className="border-[var(--border)]" />

            <article className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">What is a Word Counter?</h2>
                    <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                        A Word Counter is a text analysis utility that measures key metrics from your writing in real time. It computes standard dimensions such as total words, character count (with and without space buffers), sentences, paragraphs, and reading and speaking times. It also monitors keyword density to help you identify repetitive terms.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">How to use Word Counter</h2>
                    <ol className="mt-2 list-decimal list-inside space-y-2 text-base leading-7 text-[var(--muted)]">
                        <li>Type your document or copy and paste your drafts straight into the input text area.</li>
                        <li>Observe the statistics card panel updates dynamically on every key stroke.</li>
                        <li>Review the keyword density section to observe word patterns and frequency breakdowns.</li>
                        <li>Click <strong>Copy text</strong> to transfer the text block or click <strong>Clear</strong> to start a new analysis.</li>
                    </ol>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Benefits of Word Counter</h3>
                        <ul className="mt-2 list-disc list-inside space-y-2 text-sm leading-6 text-[var(--muted)]">
                            <li><strong>Time Estimations</strong>: Translates word quantities into estimates for silent reading rates and spoken delivery paces.</li>
                            <li><strong>Content Formatting</strong>: Helps keep articles, essays, and reports aligned with publisher length limits.</li>
                            <li><strong>Local Processing Sandbox</strong>: Operates entirely inside your browser&apos;s client-side scripting context. Your copy stays safe in memory and is never uploaded.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Frequently Asked Questions (FAQ)</h3>
                        <div className="mt-2 space-y-3 text-sm leading-6 text-[var(--muted)]">
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">How is the silent reading time calculated?</p>
                                <p>We assume an industry standard baseline rate of 200 words per minute. This rate matches average adult comprehension patterns for reading online text.</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--foreground)]">How is the speaking rate estimated?</p>
                                <p>We assume a conversational standard rate of 130 words per minute, which is typical for prepared speeches, audiobooks, and standard presentations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-soft)]">
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                {label}
            </span>
            <span className="mt-2 block text-2xl font-bold tracking-tight text-[var(--foreground)]">
                {value}
            </span>
        </div>
    );
}
