"use client";

import { FiFileText } from "react-icons/fi";

export default function NotesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br  to-zinc-100 px-6 py-12">
      <div className="flex w-full max-w-2xl flex-col items-center gap-5 rounded-3xl  p-10 text-center  shadow-zinc-200 backdrop-blur">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 shadow-inner">
          <FiFileText className="h-10 w-10" />
        </div>
        <p className="text-xs uppercase tracking-[0.6em] text-zinc-400">Notes</p>
        <h1 className="text-4xl font-bold text-zinc-900">Personal workspace</h1>
        <p className="max-w-xl text-sm text-zinc-500">
          Capture your ideas, checklists, and reminders in one secure place.
          Everything is end-to-end encrypted, accessible only to you.
        </p>
        
      </div>
    </div>
  );
}
