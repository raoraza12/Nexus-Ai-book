import { ELITE_BOOK_CONTENT, ChapterContent } from "./book-content";

export interface SearchResult {
  chapterNumber: number;
  title: string;
  snippet: string;
  matchType: "title" | "heading" | "content";
}

export const searchChapters = (query: string): SearchResult[] => {
  if (!query || query.length < 2) return [];

  const results: SearchResult[] = [];
  const normalizedQuery = query.toLowerCase();

  Object.entries(ELITE_BOOK_CONTENT).forEach(([num, content]) => {
    const chapterNumber = parseInt(num);
    const title = content.title;
    const body = content.markdown;

    // 1. Check Title (High Priority)
    if (title.toLowerCase().includes(normalizedQuery)) {
      results.push({
        chapterNumber,
        title,
        snippet: body.substring(0, 100).replace(/[#*`]/g, "").trim() + "...",
        matchType: "title",
      });
      return;
    }

    // 2. Check Headings (Medium Priority)
    const lines = body.split("\n");
    const headingMatch = lines.find(line => 
      line.startsWith("#") && line.toLowerCase().includes(normalizedQuery)
    );
    if (headingMatch) {
      results.push({
        chapterNumber,
        title,
        snippet: headingMatch.replace(/[#*`]/g, "").trim() + "...",
        matchType: "heading",
      });
      return;
    }

    // 3. Check Body Content (Low Priority)
    const contentIndex = body.toLowerCase().indexOf(normalizedQuery);
    if (contentIndex !== -1) {
      const start = Math.max(0, contentIndex - 40);
      const end = Math.min(body.length, contentIndex + 60);
      let snippet = body.substring(start, end).replace(/[#*`]/g, "").trim();
      if (start > 0) snippet = "..." + snippet;
      if (end < body.length) snippet = snippet + "...";

      results.push({
        chapterNumber,
        title,
        snippet,
        matchType: "content",
      });
    }
  });

  return results.slice(0, 5); // Limit to 5 results
};

// ── Search History ───────────────────────────────────────────

const HISTORY_KEY = "nexus_search_history";

export const getSearchHistory = (): string[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToHistory = (query: string) => {
  if (typeof window === "undefined" || !query) return;
  const history = getSearchHistory();
  const updatedHistory = [
    query,
    ...history.filter(q => q !== query)
  ].slice(0, 3); // Keep only last 3
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const removeFromHistory = (query: string) => {
  if (typeof window === "undefined") return;
  const history = getSearchHistory();
  const updatedHistory = history.filter(q => q !== query);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};
