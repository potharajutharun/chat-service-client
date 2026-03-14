"use client";

import type { ReactNode } from "react";

export type AttachmentAction = {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
};

type Props = {
  open: boolean;
  actions: AttachmentAction[];
  onAction: (actionId: string) => void;
};

export function AttachmentMenu({ open, actions, onAction }: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute left-0 bottom-full mb-3 w-48 rounded-3xl border border-zinc-200 bg-white shadow-lg">
      <div className="space-y-1 p-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl border border-transparent bg-zinc-50 px-3 py-2 text-left text-sm font-semibold text-zinc-700 transition hover:border-zinc-200"
            onClick={() => onAction(action.id)}
          >
            <span className="text-lg">{action.icon}</span>
            <div className="flex flex-col text-xs">
              <span className="font-semibold text-zinc-900">{action.label}</span>
              <span className="text-[10px] font-normal text-zinc-500">
                {action.description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
