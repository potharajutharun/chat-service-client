"use client";

import { FiX } from "react-icons/fi";
import type { ChangeEvent, FormEvent } from "react";

type NoteFormOverlayProps = {
  open: boolean;
  mode: "create" | "edit";
  title: string;
  description: string;
  collaborators: string;
  content: string;
  imageUrl: string | null;
  isSaving: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCollaboratorsChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onImageSelect: (file: File | null) => void;
  onImageRemove: () => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function NoteFormOverlay({
  open,
  mode,
  title,
  description,
  collaborators,
  content,
  imageUrl,
  isSaving,
  onTitleChange,
  onDescriptionChange,
  onCollaboratorsChange,
  onContentChange,
  onImageSelect,
  onImageRemove,
  onClose,
  onSubmit,
}: NoteFormOverlayProps) {
  if (!open) {
    return null;
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onImageSelect(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-zinc-500">
          {mode === "create" ? "New note" : "Edit note"}
        </p>
        <form className="mt-4 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
              Title
            </label>
            <input
              type="text"
              className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none"
              placeholder="Title"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
              Description
            </label>
            <textarea
              rows={2}
              className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none"
              placeholder="Description"
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
              Collaborators
            </label>
            <input
              type="text"
              className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none"
              placeholder="Comma-separated names"
              value={collaborators}
              onChange={(event) => onCollaboratorsChange(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
              Image
            </label>
            <div className="flex items-center gap-3">
              <label
                className="cursor-pointer rounded-2xl border border-dashed border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-600 hover:border-zinc-400"
                htmlFor="notes-image-upload"
              >
                Browse
              </label>
              <input
                id="notes-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {imageUrl && (
                <button
                  type="button"
                  className="text-xs text-rose-500 underline-offset-2 hover:underline"
                  onClick={onImageRemove}
                >
                  Remove
                </button>
              )}
            </div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Attached note"
                className="mt-2 h-40 w-full rounded-2xl object-cover"
              />
            )}
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
              Content
            </label>
            <textarea
              rows={6}
              className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none"
              placeholder="Write your note..."
              value={content}
              onChange={(event) => onContentChange(event.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-zinc-500 transition hover:text-zinc-700"
              onClick={onClose}
              disabled={isSaving}
            >
              <FiX />
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
              disabled={isSaving || !content.trim()}
            >
              {isSaving ? "Saving..." : mode === "create" ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
