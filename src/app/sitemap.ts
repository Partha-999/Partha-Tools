import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://parthatools.me";

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

    return [...staticPages, ...toolPages];
}
