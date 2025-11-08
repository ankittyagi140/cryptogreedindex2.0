import type { MetadataRoute } from "next";

const baseUrl = "https://www.cryptogreedindex.com";

const staticRoutes = [
  "",
  "coins",
  "about",
  "contact",
  "legal/privacy",
  "legal/terms",
  "legal/disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return staticRoutes.map((path) => {
    const url = path ? `${baseUrl}/${path}` : baseUrl;

    return {
      url,
      lastModified,
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.6,
    };
  });
}
