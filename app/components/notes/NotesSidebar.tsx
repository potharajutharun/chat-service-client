"use client";

import { useMemo, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import type { Note, SaveNotePayload } from "@/app/services/workspaceService";
import { NoteCard, type Reminder } from "./NoteCard";
import { NoteFormOverlay } from "./NoteFormOverlay";

type NotesSidebarProps = {
  notes: Note[];
  isSaving: boolean;
  onSaveNote: (payload: SaveNotePayload) => Promise<void>;
  onEditNote: (noteId: string, updates: Partial<Note>) => void;
  onDeleteNote: (noteId: string) => void;
  onOpenNotes: () => void;
};

type NoteFormState = {
  title: string;
  description: string;
  collaborators: string;
  content: string;
  imageUrl: string | null;
  mode: "create" | "edit" | null;
  noteId: string | null;
};

const initialFormState: NoteFormState = {
  title: "",
  description: "",
  collaborators: "",
  content: "",
  imageUrl: null,
  mode: null,
  noteId: null,
};

export function NotesSidebar({
  notes,
  isSaving,
  onSaveNote,
  onEditNote,
  onDeleteNote,
  onOpenNotes,
}: NotesSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [scheduledReminders, setScheduledReminders] = useState<Record<string, Reminder[]>>({});
  const [currentReminderNoteId, setCurrentReminderNoteId] = useState<string | null>(null);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);
  const [isReminderOverlayOpen, setIsReminderOverlayOpen] = useState(false);
  const [noteForm, setNoteForm] = useState(initialFormState);
  const [noteFormLoading, setNoteFormLoading] = useState(false);

  const filteredNotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return notes;
    }
    return notes.filter((note) => {
      const haystack = `${note.title ?? ""} ${note.description ?? ""} ${note.content}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [notes, searchTerm]);

  const noteReminders = (noteId: string) => scheduledReminders[noteId] ?? [];
  const currentReminderNote = currentReminderNoteId
    ? notes.find((item) => item.noteId === currentReminderNoteId) ?? null
    : null;
  const reminderOverlayTitle = currentReminderNote?.title ?? "Notify note";

  const openNoteForm = (mode: "create" | "edit", note?: Note) => {
    setNoteForm({
      title: note?.title ?? "",
      description: note?.description ?? "",
      collaborators: note?.collaborators?.join(", ") ?? "",
      content: note?.content ?? "",
      imageUrl: note?.imageUrl ?? null,
      mode,
      noteId: mode === "edit" ? note?.noteId ?? null : null,
    });
  };

  const closeNoteForm = () => {
    setNoteForm(initialFormState);
    setNoteFormLoading(false);
  };

  const handleSaveNoteForm = async () => {
    if (!noteForm.mode) {
      return;
    }
    const trimmed = noteForm.content.trim();
    if (!trimmed) {
      return;
    }
    const collaboratorList = noteForm.collaborators
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const payload: SaveNotePayload = {
      content: trimmed,
      title: noteForm.title.trim() || undefined,
      description: noteForm.description.trim() || undefined,
      collaborators: collaboratorList.length ? collaboratorList : undefined,
      imageUrl: noteForm.imageUrl ?? undefined,
    };
    if (noteForm.mode === "create") {
      setNoteFormLoading(true);
      try {
        await onSaveNote(payload);
        closeNoteForm();
      } finally {
        setNoteFormLoading(false);
      }
      return;
    }
    if (noteForm.mode === "edit" && noteForm.noteId) {
      onEditNote(noteForm.noteId, payload);
      closeNoteForm();
    }
  };

  const handleNotifyClick = (noteId: string) => {
    const now = new Date();
    setCurrentReminderNoteId(noteId);
    setReminderDate(now.toISOString().slice(0, 10));
    setReminderTime(now.toTimeString().slice(0, 5));
    setReminderMessage(null);
    setIsReminderOverlayOpen(true);
  };

  const handleScheduleReminder = () => {
    if (!currentReminderNoteId) {
      return;
    }
    if (!reminderDate || !reminderTime) {
      setReminderMessage("Please choose both a date and time.");
      return;
    }
    const scheduledAt = new Date(`${reminderDate}T${reminderTime}`);
    setScheduledReminders((prev) => ({
      ...prev,
      [currentReminderNoteId]: [
        ...(prev[currentReminderNoteId] ?? []),
        { scheduledAt: scheduledAt.toISOString(), createdAt: new Date().toISOString() },
      ],
    }));
    setReminderMessage(`Scheduled for ${scheduledAt.toLocaleString()}.`);
    setIsReminderOverlayOpen(false);
    setCurrentReminderNoteId(null);
  };

  const handleCloseReminderOverlay = () => {
    setIsReminderOverlayOpen(false);
    setCurrentReminderNoteId(null);
  };

  const handleImageSelect = (file: File | null) => {
    if (!file) {
      setNoteForm((prev) => ({ ...prev, imageUrl: null }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setNoteForm((prev) => ({ ...prev, imageUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-1 flex-col px-4 pb-3">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-500">Notes</p>
          <p className="text-2xl font-bold text-zinc-900">Workspace</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-2xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400"
          onClick={() => openNoteForm("create")}
        >
          <FiPlus className="text-sm" />
          Create
        </button>
      </div>
      <div className="mt-4 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <FiSearch />
          <input
            type="search"
            className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            placeholder="Search notes"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>
      <div className="mt-4 flex-1 space-y-4 overflow-y-auto px-1">
        {filteredNotes.length === 0 ? (
          <p className="text-xs text-zinc-500">No notes yet.</p>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.noteId}
              note={note}
              authorName="You"
              reminders={noteReminders(note.noteId)}
              onEdit={() => openNoteForm("edit", note)}
              onDelete={() => onDeleteNote(note.noteId)}
              onNotify={() => handleNotifyClick(note.noteId)}
              onExit={onOpenNotes}
            />
          ))
        )}
      </div>
      {isReminderOverlayOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
          onClick={handleCloseReminderOverlay}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-zinc-500">
              Notify
            </p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">{reminderOverlayTitle}</p>
            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none"
                  value={reminderDate}
                  onChange={(event) => setReminderDate(event.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                  Time
                </label>
                <input
                  type="time"
                  className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none"
                  value={reminderTime}
                  onChange={(event) => setReminderTime(event.target.value)}
                />
              </div>
            </div>
            {reminderMessage && (
              <p className="mt-3 text-[12px] text-rose-500">{reminderMessage}</p>
            )}
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                className="text-sm font-semibold text-zinc-500 underline-offset-4 hover:underline"
                onClick={handleCloseReminderOverlay}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-emerald-600"
                onClick={handleScheduleReminder}
              >
                Notify
              </button>
            </div>
          </div>
        </div>
      )}
      <NoteFormOverlay
        open={Boolean(noteForm.mode)}
        mode={noteForm.mode ?? "create"}
        title={noteForm.title}
        description={noteForm.description}
        collaborators={noteForm.collaborators}
        content={noteForm.content}
        imageUrl={noteForm.imageUrl}
        isSaving={noteFormLoading || isSaving}
        onTitleChange={(value) => setNoteForm((prev) => ({ ...prev, title: value }))}
        onDescriptionChange={(value) => setNoteForm((prev) => ({ ...prev, description: value }))}
        onCollaboratorsChange={(value) => setNoteForm((prev) => ({ ...prev, collaborators: value }))}
        onContentChange={(value) => setNoteForm((prev) => ({ ...prev, content: value }))}
        onImageSelect={handleImageSelect}
        onImageRemove={() => setNoteForm((prev) => ({ ...prev, imageUrl: null }))}
        onClose={closeNoteForm}
        onSubmit={(event) => {
          event.preventDefault();
          void handleSaveNoteForm();
        }}
      />
    </div>
  );
}
