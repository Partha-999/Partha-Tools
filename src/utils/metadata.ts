import type { Metadata } from "next";
import { getToolBySlug } from "@/data/tools";

export function getToolMetadata(slug: string, defaultTitle: string, defaultDesc: string): Metadata {
    const tool = getToolBySlug(slug);
    const title = tool ? tool.seoTitle : defaultTitle;
    const description = tool ? tool.seoDescription : defaultDesc;

    return {
        title,
        description,
        alternates: {
            canonical: `/tools/${slug}`,
        },
        openGraph: {
            title,
            description,
            url: `https://www.parthatools.me/tools/${slug}`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}
