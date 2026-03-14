"use client";

import { useMemo, useState } from "react";
import {
  FiChevronDown,
  FiMoreHorizontal,
  FiPhoneIncoming,
  FiPhoneOutgoing,
  FiPlusSquare,
  FiSearch,
  FiUserPlus,
} from "react-icons/fi";
import type { Conversation } from "@/app/types/chat";
import type { CallHistoryEntry } from "@/app/components/chat/CallView";
import type { Note, SaveNotePayload } from "@/app/services/workspaceService";
import { formatTimestamp } from "@/app/lib/format";
import { MdAddCall } from "react-icons/md";
import { NotesSidebar } from "@/app/components/notes/NotesSidebar";

export type SidebarMode = "chats" | "archived" | "calls" | "notes";

type Props = {
  mode: SidebarMode;
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelect: (conversationId: string) => void;
  isLoading: boolean;
  error: string | null;
  onOpenNewChat: () => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  callHistory: CallHistoryEntry[];
  onStartCall: () => void;
  notes: Note[];
  onOpenNotes: () => void;
  onDeleteNote: (noteId: string) => void;
  onEditNote: (noteId: string, updates: Partial<Note>) => void;
  onSaveNote: (payload: SaveNotePayload) => Promise<void>;
  isNotesSaving: boolean;
};

type Reminder = {
  scheduledAt: string;
  createdAt: string;
};

const chatFilters = ["All", "Unread", "Favourites"] as const;

export function ConversationSidebar({
  mode,
  conversations,
  selectedConversationId,
  onSelect,
  isLoading,
  error,
  onOpenNewChat,
  searchTerm,
  onSearchTermChange,
  callHistory,
  onStartCall,
  notes,
  onOpenNotes,
  onDeleteNote,
  onEditNote,
  onSaveNote,
}: Props) {
  const [activeFilter, setActiveFilter] = useState<typeof chatFilters[number]>("All");
  const [callSearchTerm, setCallSearchTerm] = useState("");

  const filteredCallHistory = useMemo(() => {
    const term = callSearchTerm.trim().toLowerCase();
    if (!term) return callHistory;
    return callHistory.filter((call) =>
      `${call.title} ${call.statusLabel} ${call.dateLabel}`.toLowerCase().includes(term),
    );
  }, [callHistory, callSearchTerm]);

  const filteredConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return conversations.filter((conversation) => {
      if (activeFilter === "Unread" && !(conversation.unreadCount ?? 0)) {
        return false;
      }
      if (activeFilter === "Favourites" && (conversation.unreadCount ?? 0) > 0) {
        return false;
      }
      if (!term) {
        return true;
      }
      const haystack = `${conversation.conversationId} ${conversation.lastMessageId ?? ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [activeFilter, conversations, searchTerm]);

  const renderFilterPills = () => (
    <div className="px-4 pb-3">
      <div className="flex items-center gap-2">
        {chatFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`flex-1 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
              activeFilter === filter
                ? "border-emerald-500 bg-emerald-500/15 text-emerald-600"
                : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400"
        >
          <FiChevronDown />
        </button>
      </div>
    </div>
  );

  const renderChats = () => (
    <>
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-500">
              {mode === "archived" ? "Archived" : "Chats"}
            </p>
            <p className="text-2xl font-bold text-zinc-900">
              {mode === "archived" ? "Archive" : "Recent chats"}
            </p>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:border-zinc-400"
            onClick={onOpenNewChat}
            aria-label="Start new chat"
          >
            <FiPlusSquare />
          </button>
        </div>
        <div className="mt-4 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <FiSearch className="text-zinc-400" />
            <input
              type="search"
              className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
              placeholder="Search or start a new chat"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="px-4 pb-3">{renderFilterPills()}</div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading && <p className="px-2 text-xs text-amber-500">Loading chats…</p>}
        {error && <p className="px-2 text-xs text-rose-500">{error}</p>}
        {!filteredConversations.length && !isLoading && (
          <p className="px-2 text-xs text-zinc-400">No conversations yet.</p>
        )}
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.conversationId}
              className={`group flex w-full flex-col gap-2 rounded-3xl border px-3 py-4 text-left transition ${
                selectedConversationId === conversation.conversationId
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-transparent bg-white/80 hover:border-emerald-200"
              }`}
              onClick={() => onSelect(conversation.conversationId)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200 bg-gradient-to-br from-emerald-500/70 to-emerald-300 text-lg font-semibold text-white">
                    {conversation.conversationId[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {conversation.conversationId.slice(0, 12)}
                    </p>
                    <p className="text-[12px] text-zinc-500">
                      {conversation.unreadCount
                        ? `${conversation.unreadCount} unread`
                        : "All caught up"}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-400">
                  {formatTimestamp(conversation.lastMessageAt) ?? "—"}
                </span>
              </div>
              <div className="flex justify-end text-[12px] text-zinc-400">
                <FiMoreHorizontal />
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  const renderCalls = () => (
    <div className="flex flex-1 flex-col px-4 pb-2">
      <div className="flex items-center justify-between gap-3 mt-2">
        <div>
          <p className="text-2xl font-bold text-zinc-900">Calls</p>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-green-500 bg-white text-green-500"
          onClick={onStartCall}
          aria-label="Place a call"
        >
          <MdAddCall />
        </button>
      </div>
      <div className="mt-4 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-2">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <FiSearch className="text-zinc-400" />
          <input
            type="search"
            className="flex-1 bg-transparent text-sm text-zinc-500 placeholder:text-zinc-400 focus:outline-none"
            placeholder="Search name or number"
            value={callSearchTerm}
            onChange={(event) => setCallSearchTerm(event.target.value)}
          />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-xs font-semibold text-green-500">Favourites</p>
        <div className="flex items-center gap-3 rounded-2xl bg-white py-3 px-3 text-md">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-lg text-green-800">
            <FiUserPlus />
          </span>
          <span>Add favourite</span>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xs font-semibold text-zinc-500">Recent</p>
        <div className="space-y-3 mt-3 overflow-y-auto">
          {filteredCallHistory.length === 0 ? (
            <p className="text-xs text-zinc-500">No recent calls.</p>
          ) : (
            filteredCallHistory.map((call) => {
              const isMissed = call.statusLabel.toLowerCase().includes("missed");
              const CallIcon = call.type === "video" ? FiPhoneOutgoing : FiPhoneIncoming;
              return (
                <div
                  key={call.callId}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-lg font-semibold text-zinc-500">
                      {call.title[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{call.title}</p>
                      <div className="flex items-center gap-2 text-[12px]">
                        <CallIcon className={`${isMissed ? "text-rose-500" : "text-zinc-500"} text-base`} />
                        <span className={`${isMissed ? "text-rose-500" : "text-zinc-500"}`}>
                          {call.statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-zinc-400">{call.dateLabel}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const renderNotes = () => {
    return (
      <div className="flex flex-1 flex-col px-4 pb-3">
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-500">Notes</p>
            <p className="text-lg font-semibold text-zinc-900">Workspace</p>
          </div>
          <button
            type="button"
            className="rounded-2xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700"
            onClick={() => openNoteForm("create")}
          >
            + Create
          </button>
        </div>
        <div className="mt-4 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <FiSearch className="text-zinc-400" />
            <input
              type="search"
              className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
              placeholder="Search notes"
              value={noteSearchTerm}
              onChange={(event) => setNoteSearchTerm(event.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 space-y-3 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <p className="text-xs text-zinc-500">No notes yet.</p>
          ) : (
            filteredNotes.map((note) => {
              const reminders = noteReminders(note.noteId);
              const now = new Date();
              const isNotified = reminders.some((entry) => new Date(entry.scheduledAt) <= now);
              const latestReminder = reminders[reminders.length - 1] ?? null;
              const reminderDateLabel = latestReminder
                ? new Date(latestReminder.scheduledAt)
                : null;
              return (
                <div
                  key={note.noteId}
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      {note.title && (
                        <p className="text-sm font-semibold text-zinc-900">{note.title}</p>
                      )}
                      {note.description && (
                        <p className="text-sm text-zinc-500">{note.description}</p>
                      )}
                      {note.imageUrl && (
                        <img
                          src={note.imageUrl}
                          alt=""
                          className="h-32 w-full rounded-2xl object-cover"
                        />
                      )}
                      <p className="text-sm text-zinc-900 line-clamp-3 whitespace-pre-line">
                        {note.content}
                      </p>
                      {note.collaborators?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {note.collaborators.map((collaborator) => (
                            <span
                              key={collaborator}
                              className="rounded-full border border-zinc-200 px-3 py-1 text-[10px] text-zinc-600"
                            >
                              {collaborator}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    {reminders.length > 0 && (
                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${
                          isNotified
                            ? "border-emerald-200 text-emerald-600"
                            : "border-amber-200 text-amber-600"
                        }`}
                      >
                        {isNotified ? "Notified" : "Scheduled"}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-[11px] text-zinc-500">
                    {new Date(note.createdAt).toLocaleString()}
                  </div>
                  {reminderDateLabel && (
                    <p className="text-[11px] text-zinc-500">
                      {isNotified
                        ? `Notified ${reminderDateLabel.toLocaleString()}`
                        : `Scheduled ${reminderDateLabel.toLocaleString()}`}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                    <button
                      type="button"
                      className="rounded-full border border-zinc-200 p-1 transition hover:border-rose-400"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Delete this note? This action cannot be undone.",
                          )
                        ) {
                          onDeleteNote(note.noteId);
                        }
                      }}
                      aria-label="Delete note"
                    >
                      <FiTrash2 className="text-[12px]" />
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-zinc-200 p-1 transition hover:border-emerald-400"
                      onClick={() => handleNotifyClick(note.noteId)}
                      aria-label="Notify note"
                    >
                      {reminders.length > 0 ? (
                        <span className="text-emerald-500 text-[12px]">⏰</span>
                      ) : (
                        <FiBell className="text-[12px]" />
                      )}
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-zinc-200 p-1 transition hover:border-sky-400"
                      onClick={() => openNoteForm("edit", note)}
                      aria-label="Edit note"
                    >
                      <FiEdit3 className="text-[12px]" />
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-zinc-200 p-1 transition hover:border-zinc-400"
                      onClick={() => onOpenNotes()}
                      aria-label="Exit note"
                    >
                      <FiX className="text-[12px]" />
                    </button>
                  </div>
                </div>
              );
            })
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
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {reminderOverlayTitle}
              </p>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                    Date
                  </label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none"
                    value={reminderDate}
                    onChange={(event) => setReminderDate(event.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                    Time
                  </label>
                  <input
                    type="time"
                    className="mt-1 w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none"
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
        {noteFormMode && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={closeNoteForm}
          >
            <div
              className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-zinc-500">
                {noteFormMode === "create" ? "New note" : "Edit note"}
              </p>
              <div className="mt-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none"
                    value={noteFormTitle}
                    onChange={(event) => setNoteFormTitle(event.target.value)}
                    placeholder="Give your note a title"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none"
                    value={noteFormDescription}
                    onChange={(event) => setNoteFormDescription(event.target.value)}
                    placeholder="Add a short description"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                    Collaborators
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none"
                    value={noteFormCollaborators}
                    onChange={(event) => setNoteFormCollaborators(event.target.value)}
                    placeholder="Comma-separated names"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                    Image
                  </label>
                  <div className="flex items-center gap-3">
                    <label
                      className="cursor-pointer rounded-2xl border border-dashed border-zinc-300 px-3 py-1 text-xs font-semibold text-zinc-600 hover:border-zinc-400"
                      htmlFor="note-image-input"
                    >
                      Add image
                    </label>
                    <input
                      id="note-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleNoteImageChange}
                    />
                    {noteFormImage && (
                      <button
                        type="button"
                        className="text-xs text-rose-500 underline-offset-2 hover:underline"
                        onClick={() => setNoteFormImage(null)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {noteFormImage && (
                    <div className="relative">
                      <img
                        src={noteFormImage}
                        alt="Note attachment preview"
                        className="mt-2 h-40 w-full rounded-2xl object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                    Content
                  </label>
                  <textarea
                    className="h-32 w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none"
                    rows={6}
                    value={noteFormContent}
                    onChange={(event) => setNoteFormContent(event.target.value)}
                  />
                </div>
              </div>
              {noteFormError && (
                <p className="mt-2 text-[12px] text-rose-500">{noteFormError}</p>
              )}
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-zinc-500 underline-offset-4 hover:underline"
                  onClick={closeNoteForm}
                  disabled={noteFormLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
                  onClick={handleSaveNoteForm}
                  disabled={noteFormLoading}
                >
                  {noteFormMode === "create" ? "Create" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-[340px] flex-shrink-0 border-r border-zinc-200 bg-white text-zinc-800">
      <div className="flex h-full flex-col">
        {mode === "calls" ? renderCalls() : mode === "notes" ? renderNotes() : renderChats()}
      </div>
    </aside>
  );

}
