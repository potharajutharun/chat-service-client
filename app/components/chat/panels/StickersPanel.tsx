"use client";

import { FloatingPanel } from "@/app/components/ui/FloatingPanel";

type Props = {
  open: boolean;
  stickerLibrary: string[];
  newStickerLabel: string;
  onNewStickerChange: (value: string) => void;
  onAddSticker: () => void;
  onClose: () => void;
};

export function StickersPanel({
  open,
  stickerLibrary,
  newStickerLabel,
  onNewStickerChange,
  onAddSticker,
  onClose,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <FloatingPanel
      open={open}
      title="Stickers"
      subtitle="Browse from your collection"
      categoryLabel="Attachment"
      widthClassName="max-w-md"
      onClose={onClose}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-3">
          {stickerLibrary.map((sticker, index) => (
            <div
              key={`${sticker}-${index}`}
              className="flex h-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-2xl"
            >
              {sticker}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            Add new sticker
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
              placeholder="Emoji, phrase, or icon"
              value={newStickerLabel}
              onChange={(event) => onNewStickerChange(event.target.value)}
            />
            <button
              type="button"
              className="rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
              onClick={onAddSticker}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </FloatingPanel>
  );
}
