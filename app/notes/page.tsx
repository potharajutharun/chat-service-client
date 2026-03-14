"use client";

import { useEffect, useMemo, useState } from "react";
import { NotesPanel } from "../components/workspace/NotesPanel";
import {
  fetchNotes,
  saveNote,
  Note,
} from "../services/workspaceService";
import { fetchTenantUsers, TenantUser } from "../services/userService";
import { deriveAuthInfo } from "../lib/auth";

export default function NotesPage() {
  const auth = deriveAuthInfo();
  const [notes, setNotes] = useState<Note[]>([]);
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [noteList, userList] = await Promise.all([
          fetchNotes(auth.token),
          fetchTenantUsers(auth.tenantId, auth.token),
        ]);
        setNotes(noteList);
        setUsers(userList);
      } catch (error) {
        console.warn("Unable to load notes page", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [auth.tenantId, auth.token]);

  const handleSaveNote = async (content: string) => {
    setIsSaving(true);
    try {
      await saveNote({ content }, auth.token);
      const updated = await fetchNotes(auth.token);
      setNotes(updated);
    } catch (error) {
      console.warn("Unable to save note", error);
    } finally {
      setIsSaving(false);
    }
  };

  const placeholder = useMemo(
    () =>
      isLoading
        ? "Loading your notes…"
        : notes.length
        ? ""
        : "No notes yet; start capturing post-call thoughts.",
    [isLoading, notes.length],
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6 py-10">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Personal workspace
          </p>
          <h1 className="text-3xl font-semibold text-white">Notes & thoughts</h1>
          <p className="text-sm text-zinc-400">{placeholder}</p>
        </header>
        <NotesPanel
          notes={notes}
          users={users}
          onSaveNote={handleSaveNote}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
