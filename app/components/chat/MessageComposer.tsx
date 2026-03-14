"use client";

import type { FormEvent } from "react";
import { IoMdAdd } from "react-icons/io";

import { BiSend } from "react-icons/bi";
import { AttachmentMenu, type AttachmentAction } from "./AttachmentMenu";

type Props = {
  messageText: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onMarkAsRead: () => void;
  isDisabled: boolean;
  isSending: boolean;
  isMarkingRead: boolean;
  hasMessages: boolean;
  actionInfo: string | null;
  attachmentActions: AttachmentAction[];
  isAttachmentMenuOpen: boolean;
  onAttachmentToggle: () => void;
  onAttachmentAction: (actionId: string) => void;
};

export function MessageComposer({
  messageText,
  onChange,
  onSubmit,
  onMarkAsRead,
  isDisabled,
  isSending,
  isMarkingRead,
  hasMessages,
  actionInfo,
  attachmentActions,
  onAttachmentToggle,
  isAttachmentMenuOpen,
  onAttachmentAction,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="border-t border-zinc-200 bg-white px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="relative flex flex-1 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus-within:border-emerald-500">
          <button
            type="button"
            className="flex h-10 w-10 min-w-[38px] items-center justify-center rounded-full border border-transparent bg-transparent text-lg font-semibold text-zinc-400 transition hover:text-white"
            onClick={onAttachmentToggle}
            aria-label="Open attachment menu"
          >
            <IoMdAdd/>
          </button>
          <AttachmentMenu
            open={isAttachmentMenuOpen}
            actions={attachmentActions}
            onAction={onAttachmentAction}
          />
            <input
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              placeholder="Type a message..."
              value={messageText}
              onChange={(event) => onChange(event.target.value)}
              disabled={isDisabled || isSending}
            />
        </div>
        <button
          type="submit"
          className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/50"
          disabled={isDisabled || !messageText.trim() || isSending}
        >
          {isSending ? "Sending..." : <BiSend/>}
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
        <button
          type="button"
          className="text-left underline-offset-2 transition hover:underline disabled:opacity-40"
          onClick={onMarkAsRead}
          disabled={!hasMessages || isMarkingRead}
        >
          {isMarkingRead ? "Marking..." : "Mark latest read"}
        </button>
        {actionInfo && <span className="text-emerald-300">{actionInfo}</span>}
      </div>
    </form>
  );
}

export type { AttachmentAction } from "./AttachmentMenu";
