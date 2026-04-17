import { createClient } from "@/lib/supabase/server";
import { MASTER_BOOK_ID, MASTER_BOOK_SLUG } from "@/lib/constants";
import { ReaderSidebar } from "@/components/reader-sidebar";
import { ReaderShell } from "@/components/reader-shell";

// Fallback dummy data if DB is empty
const DUMMY_CHAPTERS = [
  { id: "1", chapter_number: 1, title: "Introduction to Agentic AI", section: "Junior" },
  { id: "2", chapter_number: 2, title: "LLM Fundamentals", section: "Junior" },
  { id: "3", chapter_number: 3, title: "Prompt Engineering & Few-Shot", section: "Junior" },
  { id: "4", chapter_number: 4, title: "RAG Systems (Retrieval-Augmented)", section: "Intermediate" },
  { id: "5", chapter_number: 5, title: "Vector Databases Deep Dive", section: "Intermediate" },
  { id: "6", chapter_number: 6, title: "Building Autonomous Agents", section: "Senior" },
  { id: "7", chapter_number: 7, title: "Multi-Agent Orchestration", section: "Senior" },
  { id: "8", chapter_number: 8, title: "Deployment & Production CI/CD", section: "Senior" },
];

export default async function BookLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ book_id: string }>;
}) {
  const supabase = await createClient();
  const { book_id } = await params;
  
  // Map slug to UUID for the master book
  const bookId = book_id === MASTER_BOOK_SLUG ? MASTER_BOOK_ID : book_id;

  // Try fetching chapters from DB, fallback to DUMMY_CHAPTERS
  let chapters = DUMMY_CHAPTERS;
  const { data: dbChapters } = await supabase
    .from("chapters")
    .select("id, chapter_number, title")
    .eq("book_id", bookId)
    .order("chapter_number", { ascending: true });

  if (dbChapters && dbChapters.length > 0) {
    chapters = dbChapters.map(c => ({
      ...c,
      section: c.chapter_number <= 3 ? "Junior" : c.chapter_number <= 5 ? "Intermediate" : "Senior"
    }));
  }

  return (
    <ReaderShell sidebar={<ReaderSidebar chapters={chapters as any} bookId={bookId} />}>
      {children}
    </ReaderShell>
  );
}
