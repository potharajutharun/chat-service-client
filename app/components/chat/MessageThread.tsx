"use client";

import type { ReactNode, Ref } from "react";
import { Message } from "@/app/types/chat";
import type { TenantUser } from "@/app/services/userService";
import { formatTimestamp } from "@/app/lib/format";
import { buildAvatarUrl } from "@/app/lib/avatar";

type Props = {
  messages: Message[];
  loading: boolean;
  error: string | null;
  userId: number;
  selectedConversationId: string | null;
  paneRef: Ref<HTMLDivElement>;
  users: TenantUser[];
  formatSenderLabel: (senderId: number) => string;
};

export function MessageThread({
  messages,
  loading,
  error,
  userId,
  selectedConversationId,
  paneRef,
  formatSenderLabel,
}: Props) {
  let body: ReactNode;

  if (loading) {
    body = (
      <p className="text-center text-xs text-amber-300">Loading messages...</p>
    );
  } else if (!selectedConversationId) {
    body = (
      <p className="text-center text-sm text-zinc-400">
        Pick a conversation to see messages.
      </p>
    );
  } else if (error) {
    body = (
      <p className="text-center text-xs text-rose-300">{error}</p>
    );
  } else if (!messages.length) {
    body = (
      <p className="text-center text-sm text-zinc-400">
        No messages yet; try sending hi.
      </p>
    );
    } else {
    body = (
      <>
        {messages.map((message, index) => {
          const isMine = message.senderId === userId;
          const timestamp = formatTimestamp(message.createdAt) ?? "just now";
          const senderLabel = formatSenderLabel(message.senderId);
          const avatarSeed =
            senderLabel === "You" ? `you-${message.senderId}` : senderLabel;
          const senderAvatar = buildAvatarUrl(avatarSeed);
          const rowClass = isMine
            ? "flex gap-3 flex-row-reverse items-start"
            : "flex gap-3 items-start";
          const bubbleClasses = isMine
            ? "bg-emerald-600 text-white shadow-lg"
            : "bg-white text-zinc-900 shadow-sm border border-zinc-100";

          return (
            <div
              key={message.messageId ?? `${message.createdAt ?? index}`}
              className={`${rowClass} mt-1`}
            >
              <img
                src={senderAvatar}
                alt={`${senderLabel} avatar`}
                className="h-10 w-10 rounded-full border border-zinc-200 object-cover"
              />
              <div className="flex flex-col gap-2">
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${bubbleClasses}`}
                >
                  <p className="mb-1 text-xs font-semibold text-emerald-500">
                    {senderLabel}
                  </p>
                  <p>{message.messageText}</p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                  {timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  return (
    <div ref={paneRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
      {body}
    </div>
  );
}
