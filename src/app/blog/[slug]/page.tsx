import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blog-posts";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BlogPostContent } from "@/components/blog-post-content";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found on ParthaTools.",
    };
  }

  const title = `${post.title} | ParthaTools Blog`;
  const description = post.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.parthatools.me/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["ParthaTools Founder"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.14),transparent_28%)]" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pb-20">
        <Header />
        <BlogPostContent post={post} />
        <Footer />
      </div>
    </main>
  );
}
