export interface Topic {
  title: string;
  id: string;
  level: number;
}

export const getChapterTopics = (markdown: string): Topic[] => {
  if (!markdown) return [];

  const lines = markdown.split("\n");
  const topics: Topic[] = [];

  lines.forEach((line) => {
    // Match ## Heading or ### Heading
    const match = line.match(/^(#{2,3})\s+(.*)/);
    if (match) {
      const level = match[1].length;
      const title = match[2].replace(/[#*`]/g, "").trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      topics.push({ title, id, level });
    }
  });

  return topics;
};
