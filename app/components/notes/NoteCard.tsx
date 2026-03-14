"use client";

import type { ReactNode } from "react";
import { FiBell, FiEdit3, FiTrash2, FiX } from "react-icons/fi";
import type { Note } from "@/app/services/workspaceService";

export type Reminder = {
  scheduledAt: string;
  createdAt: string;
};

type NoteCardProps = {
  note: Note;
  authorName: string;
  reminders: Reminder[];
  onEdit: () => void;
  onDelete: () => void;
  onNotify: () => void;
  onExit: () => void;
};

export function NoteCard({
  note,
  authorName,
  reminders,
  onEdit,
  onDelete,
  onNotify,
  onExit,
}: NoteCardProps) {
  const isNotified = reminders.some(
    (entry) => new Date(entry.scheduledAt) <= new Date(),
  );

  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          {note.title && <p className="text-sm font-semibold text-zinc-900">{note.title}</p>}
          {note.description && <p className="text-sm text-zinc-500">{note.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <ActionButton tooltip="End note view" onClick={onExit}>
            <FiX />
          </ActionButton>
        </div>
      </div>
      {note.imageUrl && (
        <img
          src={note.imageUrl}
          alt="Note attachment"
          className="h-32 w-full rounded-2xl object-cover"
        />
      )}
      <p className="text-sm text-zinc-900 whitespace-pre-line">{note.content}</p>
      {note.collaborators?.length ? (
        <div className="flex flex-wrap gap-2">
          {note.collaborators.map((collaborator) => (
            <span
              key={collaborator}
              className="rounded-full border border-zinc-200 px-3 py-1 text-[11px] text-zinc-600"
            >
              {collaborator}
            </span>
          ))}
        </div>
      ) : null}
      <p className="text-xs text-zinc-500">
        {new Date(note.createdAt).toLocaleString()} · {authorName}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <ActionButton tooltip="Edit note" onClick={onEdit}>
          <FiEdit3 />
        </ActionButton>
        <ActionButton variant="danger" tooltip="Delete note" onClick={onDelete}>
          <FiTrash2 />
        </ActionButton>
        <ActionButton variant="soft" tooltip="Notify note" onClick={onNotify}>
          <FiBell />
        </ActionButton>
      </div>
      {isNotified && (
        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Notified
        </div>
      )}
      <ReminderList reminders={reminders} />
    </article>
  );
}

type ActionButtonProps = {
  children: ReactNode;
  tooltip?: string;
  variant?: "default" | "danger" | "soft";
  onClick: () => void;
};

function ActionButton({ children, tooltip, variant = "default", onClick }: ActionButtonProps) {
  const baseClass = "rounded-full border p-2 text-xs transition hover:border-zinc-400";
  const variantClass =
    variant === "danger"
      ? "border-rose-200 text-rose-600 hover:border-rose-400"
      : variant === "soft"
      ? "border-emerald-200 text-emerald-600 hover:border-emerald-400"
      : "border-zinc-200 text-zinc-600";
  return (
    <button
      type="button"
      className={`${baseClass} ${variantClass}`}
      onClick={onClick}
      title={tooltip}
    >
      {children}
    </button>
  );
}

type ReminderListProps = {
  reminders: Reminder[];
};

function ReminderList({ reminders }: ReminderListProps) {
  if (!reminders.length) {
    return null;
  }
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-[13px] text-emerald-800">
      <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-600">Reminders</p>
      <div className="mt-2 space-y-2">
        {reminders.map((entry, index) => {
          const scheduled = new Date(entry.scheduledAt);
          const dayLabel = scheduled.toLocaleDateString(undefined, { weekday: "long" });
          const dateLabel = scheduled.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const timeLabel = scheduled.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <div
              key={`${entry.scheduledAt}-${index}`}
              className="flex items-center justify-between gap-4 text-[12px]"
            >
              <div>
                <p className="text-[11px] font-semibold text-emerald-700">{dayLabel}</p>
                <p className="text-[10px] text-zinc-500">
                  {dateLabel} · {timeLabel}
                </p>
              </div>
              <span className="rounded-full border border-emerald-200 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                Notified
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
