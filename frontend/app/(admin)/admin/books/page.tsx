import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";

export const metadata = { title: "Manage Books" };

export default async function AdminBooksPage() {
  const supabase = await createClient();
  const { data: books } = await supabase.from("books").select("*").order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Books Management</h1>
          <p className="text-zinc-500 mt-1">Add, edit, or remove books from the platform.</p>
        </div>
        <Link 
          href="/admin/books/new" 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> Add New Book
        </Link>
      </header>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">Title</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">Author</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">Genre</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">Added Date</th>
              <th className="px-6 py-4 font-semibold text-right text-zinc-900 dark:text-zinc-100">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {books?.map(book => (
              <tr key={book.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{book.title}</td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{book.author}</td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{book.genre ?? "-"}</td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{new Date(book.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/books/${book.id}`} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 sm:hover:text-indigo-300">
                      <Edit2 size={16} />
                    </Link>
                    <button className="text-red-600 hover:text-red-800 dark:text-red-400 sm:hover:text-red-300">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!books || books.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  No books found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
