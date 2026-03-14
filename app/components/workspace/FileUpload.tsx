"use client";

import { FormEvent, useState } from "react";

type Props = {
  onUpload: (file: File, title: string) => Promise<void>;
  isUploading: boolean;
  statusMessage: string | null;
};

export function FileUpload({ onUpload, isUploading, statusMessage }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      return;
    }
    await onUpload(file, title);
    setFile(null);
    setTitle("");
  };

  return (
    <form
      className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4"
      onSubmit={handleSubmit}
    >
      <p className="text-sm font-semibold text-white">File upload</p>
      <input
        type="text"
        placeholder="File title"
        className="rounded-xl border border-zinc-700 bg-black/40 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <input
        type="file"
        className="text-xs text-zinc-400"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      <button
        type="submit"
        className="rounded-2xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500/50"
        disabled={!file || isUploading}
      >
        {isUploading ? "Uploading…" : "Upload"}
      </button>
      {statusMessage && (
        <p className="text-xs text-zinc-300">{statusMessage}</p>
      )}
    </form>
  );
}
