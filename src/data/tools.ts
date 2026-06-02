export type ToolCategory = "Developer Tools" | "Web Tools" | "Text Tools" | "PDF Tools";

export type ToolIconName =
  | "json-formatter"
  | "json-validator"
  | "base64-encoder"
  | "base64-decoder"
  | "jwt-decoder"
  | "qr-generator"
  | "password-generator"
  | "url-encoder"
  | "url-decoder"
  | "word-counter"
  | "character-counter"
  | "merge-pdf"
  | "compress-pdf";


export type Tool = {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  description: string;
  icon: ToolIconName;
  seoTitle: string;
  seoDescription: string;
};

export type ToolCategoryMeta = {
  name: ToolCategory;
  description: string;
  icon: ToolIconName;
  tone: string;
};

export const toolCategories: ToolCategoryMeta[] = [
  {
    name: "Developer Tools",
    description: "JSON, base64, and token utilities for everyday engineering tasks.",
    icon: "json-formatter",
    tone: "from-blue-500/20 to-cyan-400/10",
  },
  {
    name: "Web Tools",
    description: "Quick generators and encoders that help prepare data for the web.",
    icon: "qr-generator",
    tone: "from-amber-500/20 to-yellow-400/10",
  },
  {
    name: "Text Tools",
    description: "Count, inspect, and clean text without leaving the page.",
    icon: "word-counter",
    tone: "from-violet-500/20 to-fuchsia-400/10",
  },
  {
    name: "PDF Tools",
    description: "Secure, client-side PDF document manipulation tools.",
    icon: "merge-pdf",
    tone: "from-red-500/20 to-rose-400/10",
  },
];

export const tools: Tool[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    slug: "json-formatter",
    category: "Developer Tools",
    description: "Pretty-print compact JSON, normalize structure, and keep payloads readable.",
    icon: "json-formatter",
    seoTitle: "JSON Formatter | ParthaTools",
    seoDescription: "Format, inspect, and tidy JSON payloads in a fast utility interface.",
  },
  {
    id: "json-validator",
    name: "JSON Validator",
    slug: "json-validator",
    category: "Developer Tools",
    description: "Validate JSON syntax and surface issues early before they reach production.",
    icon: "json-validator",
    seoTitle: "JSON Validator | ParthaTools",
    seoDescription: "Validate JSON syntax quickly and catch malformed data before it ships.",
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder",
    slug: "base64-encoder",
    category: "Developer Tools",
    description: "Encode text or snippets into Base64 for APIs, tests, and transport layers.",
    icon: "base64-encoder",
    seoTitle: "Base64 Encoder | ParthaTools",
    seoDescription: "Convert plain text to Base64 for secure transport and quick testing.",
  },
  {
    id: "base64-decoder",
    name: "Base64 Decoder",
    slug: "base64-decoder",
    category: "Developer Tools",
    description: "Decode Base64 strings back into readable text in one step.",
    icon: "base64-decoder",
    seoTitle: "Base64 Decoder | ParthaTools",
    seoDescription: "Decode Base64 strings quickly and recover the original text.",
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    slug: "jwt-decoder",
    category: "Developer Tools",
    description: "Inspect JWT header and payload contents without manual decoding.",
    icon: "jwt-decoder",
    seoTitle: "JWT Decoder | ParthaTools",
    seoDescription: "Decode JSON Web Tokens and inspect claims with clarity.",
  },
  {
    id: "qr-generator",
    name: "QR Generator",
    slug: "qr-generator",
    category: "Web Tools",
    description: "Generate shareable QR codes from URLs, text, or contact details.",
    icon: "qr-generator",
    seoTitle: "QR Generator | ParthaTools",
    seoDescription: "Create QR codes from text or links in a clean utility workflow.",
  },
  {
    id: "password-generator",
    name: "Password Generator",
    slug: "password-generator",
    category: "Web Tools",
    description: "Create strong passwords with length and character controls.",
    icon: "password-generator",
    seoTitle: "Password Generator | ParthaTools",
    seoDescription: "Generate strong passwords with custom character rules instantly.",
  },
  {
    id: "url-encoder",
    name: "URL Encoder",
    slug: "url-encoder",
    category: "Web Tools",
    description: "Encode URLs and query strings so they remain safe for transport.",
    icon: "url-encoder",
    seoTitle: "URL Encoder | ParthaTools",
    seoDescription: "Encode URLs and query strings for safe use in web requests.",
  },
  {
    id: "url-decoder",
    name: "URL Decoder",
    slug: "url-decoder",
    category: "Web Tools",
    description: "Decode URL-encoded values back into readable text.",
    icon: "url-decoder",
    seoTitle: "URL Decoder | ParthaTools",
    seoDescription: "Decode URL-encoded text and inspect the original value instantly.",
  },
  {
    id: "word-counter",
    name: "Word Counter",
    slug: "word-counter",
    category: "Text Tools",
    description: "Count words, estimate reading time, and analyze short-form content.",
    icon: "word-counter",
    seoTitle: "Word Counter | ParthaTools",
    seoDescription: "Count words, estimate reading time, and inspect text length fast.",
  },
  {
    id: "character-counter",
    name: "Character Counter",
    slug: "character-counter",
    category: "Text Tools",
    description: "Measure character length for copy limits, forms, and content checks.",
    icon: "character-counter",
    seoTitle: "Character Counter | ParthaTools",
    seoDescription: "Count characters and keep an eye on copy length with precision.",
  },
  {
    id: "merge-pdf",
    name: "Merge PDF",
    slug: "merge-pdf",
    category: "PDF Tools",
    description: "Combine multiple PDF files into a single document in your preferred order.",
    icon: "merge-pdf",
    seoTitle: "Merge PDF | ParthaTools",
    seoDescription: "Merge multiple PDF files into one easily and securely in your browser.",
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    slug: "compress-pdf",
    category: "PDF Tools",
    description: "Compress and optimize PDF files to reduce file size while maintaining readability.",
    icon: "compress-pdf",
    seoTitle: "Compress PDF | ParthaTools",
    seoDescription: "Compress PDF files online for free. Reduce PDF size securely in your browser.",
  },
];

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategory) {
  return tools.filter((tool) => tool.category === category);
}

export function searchTools(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return tools;
  }

  return tools.filter((tool) => {
    return [tool.name, tool.description, tool.category, tool.slug]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });
}
