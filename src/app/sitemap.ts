import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";
import { blogPosts } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.parthatools.me";

    // Static pages
    const staticPaths = ["", "/about", "/contact", "/privacy-policy", "/terms"];
    const staticPages = staticPaths.map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: path === "" ? 1.0 : 0.8,
    }));

    // Dynamic tools pages (from tools registry)
    const toolPages = tools.map((tool) => ({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }));

    // Blog pages
    const blogIndexPage = {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    };

    const blogPostPages = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    return [...staticPages, ...toolPages, blogIndexPage, ...blogPostPages];
}
