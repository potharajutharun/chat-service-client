"use client";

import { FiX } from "react-icons/fi";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  categoryLabel?: string;
  widthClassName?: string;
  onClose: () => void;
  children: ReactNode;
};

export function FloatingPanel({
  open,
  title,
  subtitle,
  categoryLabel,
  widthClassName,
  onClose,
  children,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-30 flex items-start justify-end px-4 py-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative pointer-events-auto w-full ${widthClassName ?? "max-w-3xl"}`}>
        <div className="flex min-h-0 flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-6">
            <div>
              {categoryLabel && (
                <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                  {categoryLabel}
                </p>
              )}
              <p className="text-lg font-semibold text-white">{title}</p>
              {subtitle && (
                <p className="text-xs text-zinc-400">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              className="text-2xl font-semibold text-zinc-400 transition hover:text-white"
              onClick={onClose}
              aria-label="Close panel"
            >
              <FiX className="pointer-events-none" />
            </button>
          </div>
          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
