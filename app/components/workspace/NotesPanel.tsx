"use client";

import type { Ref } from "react";
import type { Note } from "@/app/services/workspaceService";
import type { TenantUser } from "@/app/services/userService";

type Props = {
  notes: Note[];
  users: TenantUser[];
  historyRef?: Ref<HTMLDivElement>;
};

export function NotesPanel({ notes, users, historyRef }: Props) {
  return (
    <section className="rounded-2xl   p-4">
      <p className="text-sm font-semibold text-dark">Notes</p>
      <p className="text-xs text-zinc-400">
        Keep context, updates, or reminders for your team.
      </p>
      <div ref={historyRef} className="mt-4 space-y-3">
        {notes.length === 0 ? (
          <p className="text-xs text-zinc-500">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.noteId}
              className="rounded-2xl border border-zinc-800  px-3 py-2 text-sm"
            >
              <p >{note.content}</p>
              <p className="mt-2 text-xs text-zinc-900">
                {new Date(note.createdAt).toLocaleString()} ·{" "}
                {users.find((user) => user.id === note.authorId)?.name ?? "Unknown"}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
