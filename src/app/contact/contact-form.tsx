"use client";

import { useState } from "react";

export function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) return;
        
        // Simulate message submission
        setSubmitted(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
    };

    return (
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 sm:p-8 shadow-[var(--shadow)] backdrop-blur-xl w-full">
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">Send a Message</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
            </p>

            {submitted ? (
                <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Message Sent!</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                        Thank you for your feedback. We will review your message shortly.
                    </p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="mt-5 inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                    >
                        Send another message
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                                Name
                            </label>
                            <input
                                id="contact-name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                                Email Address
                            </label>
                            <input
                                id="contact-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="contact-subject" className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                            Subject
                        </label>
                        <input
                            id="contact-subject"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Feedback, Bug Report, Feature Request..."
                            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                            Message
                        </label>
                        <textarea
                            id="contact-message"
                            required
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your message here..."
                            className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-2 inline-flex h-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,94,239,0.2)] transition-transform hover:-translate-y-0.5"
                    >
                        Send Message
                    </button>
                </form>
            )}
        </div>
    );
}
