import { validateRSSUrl } from "./url-validator";
import { RSS_CONFIG, TIMING } from "./constants";

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

export async function fetchRSSFeed(feedUrl: string): Promise<RSSItem[]> {
  try {
    const validation = await validateRSSUrl(feedUrl);
    if (!validation.valid) {
      console.warn(`Blocked RSS fetch: ${feedUrl} - ${validation.reason}`);
      return [];
    }

    const res = await fetch(feedUrl, {
      headers: { "User-Agent": RSS_CONFIG.USER_AGENT },
      next: { revalidate: TIMING.RSS_CACHE_SEC },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    return parseRSSXml(xml, feedUrl);
  } catch {
    console.error(`Failed to fetch RSS: ${feedUrl}`);
    return [];
  }
}

function parseRSSXml(xml: string, feedUrl: string): RSSItem[] {
  const items: RSSItem[] = [];

  // Extract feed title for source name
  const feedTitleMatch = xml.match(/<channel>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>|<channel>[\s\S]*?<title>(.*?)<\/title>/);
  const feedTitle = feedTitleMatch?.[1] || feedTitleMatch?.[2] || new URL(feedUrl).hostname;

  // Extract items
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link");
    const description = extractTag(itemXml, "description");
    const pubDate = extractTag(itemXml, "pubDate");

    if (title && link) {
      items.push({
        title: stripHtml(title),
        link,
        description: stripHtml(description).slice(0, 500),
        pubDate,
        source: feedTitle,
      });
    }
  }

  return items.slice(0, RSS_CONFIG.MAX_ITEMS);
}

function extractTag(xml: string, tag: string): string {
  const cdataMatch = xml.match(new RegExp(`<${tag}><\\!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
  if (cdataMatch) return cdataMatch[1];

  const simpleMatch = xml.match(new RegExp(`<${tag}>(.*?)<\\/${tag}>`, "s"));
  return simpleMatch?.[1] || "";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

export async function fetchMultipleFeeds(feedUrls: string[]): Promise<RSSItem[]> {
  const results = await Promise.allSettled(feedUrls.map(fetchRSSFeed));

  const allItems: RSSItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  // Sort by date (newest first)
  allItems.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime() || 0;
    const dateB = new Date(b.pubDate).getTime() || 0;
    return dateB - dateA;
  });

  return allItems;
}
