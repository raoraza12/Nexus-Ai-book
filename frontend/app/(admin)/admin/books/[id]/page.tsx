import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export const metadata = { title: "Edit Book" };

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: book } = await supabase.from("books").select("*").eq("id", params.id).single();

  if (!book) notFound();

  // In a real app, you would make this a Client Component to handle form submission, 
  // or use Server Actions. For brevity, displaying the layout.
  return (
    <div className="max-w-2xl">
      <Link href="/admin/books" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Books
      </Link>
      
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">Edit Book</h1>

      <form className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-xl shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Book Title</label>
          <input 
            type="text" 
            defaultValue={book.title}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Author</label>
          <input 
            type="text" 
            defaultValue={book.author}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
          />
        </div>

        <button 
          type="button" 
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          <Save size={18} /> Update Book
        </button>
      </form>
    </div>
  );
}
