"use client";

import { formatTimestamp } from "@/app/lib/format";
import { FloatingPanel } from "@/app/components/ui/FloatingPanel";
import type { Message } from "@/app/types/chat";

type SenderOption = {
  senderId: number;
  label: string;
};

type Props = {
  open: boolean;
  selectedConversationId: string | null;
  messageSearchQuery: string;
  setMessageSearchQuery: (value: string) => void;
  searchSenderId: number | null;
  setSearchSenderId: (value: number | null) => void;
  messageSenderOptions: SenderOption[];
  messageSearchResults: Message[];
  formatSenderLabel: (senderId: number) => string;
  closeSearch: () => void;
};

export function MessageSearchPanel({
  open,
  selectedConversationId,
  messageSearchQuery,
  setMessageSearchQuery,
  searchSenderId,
  setSearchSenderId,
  messageSenderOptions,
  messageSearchResults,
  formatSenderLabel,
  closeSearch,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <FloatingPanel
      open={open}
      title="Search messages"
      subtitle={`Conversation ${selectedConversationId ?? ""}`}
      categoryLabel="Search"
      widthClassName="max-w-md"
      onClose={closeSearch}
    >
      <div className="space-y-4">
        <div className="space-y-2 text-sm">
          <label className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            Keyword
          </label>
          <input
            type="search"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
            placeholder="Search chat messages"
            value={messageSearchQuery}
            onChange={(event) => setMessageSearchQuery(event.target.value)}
          />
        </div>
        <div className="space-y-2 text-sm">
          <label className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            Sender
          </label>
          <select
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            value={searchSenderId ?? ""}
            onChange={(event) =>
              setSearchSenderId(
                event.target.value ? Number(event.target.value) : null,
              )
            }
          >
            <option value="">All senders</option>
            {messageSenderOptions.map((option) => (
              <option key={option.senderId} value={option.senderId}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500 flex items-center justify-between">
            <span>Results</span>
            <span className="text-emerald-300" aria-live="polite">
              {messageSearchResults.length} match
              {messageSearchResults.length === 1 ? "" : "es"}
            </span>
          </p>
          <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {messageSearchResults.length ? (
              messageSearchResults.map((message) => (
                <div
                  key={`${message.messageId}-${message.createdAt}`}
                  className="space-y-1 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3"
                >
                  <p className="text-sm text-white leading-relaxed">
                    {message.messageText}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>{formatSenderLabel(message.senderId)}</span>
                    <span>
                      {formatTimestamp(message.createdAt) ?? "just now"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500">
                No messages match the current filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </FloatingPanel>
  );
}
