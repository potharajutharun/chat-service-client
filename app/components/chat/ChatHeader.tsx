"use client";

import { useEffect, useRef } from "react";
import { FiCheck, FiMoreVertical, FiPhone, FiSearch, FiVideo } from "react-icons/fi";
import type { Conversation } from "@/app/types/chat";
import { formatTimestamp } from "@/app/lib/format";

export type ConversationMenuItem = {
  id: string;
  label: string;
};

type Props = {
  selectedConversation: Conversation | null;
  handleOpenCallDialog: (type: "voice" | "video") => void;
  isConversationMenuOpen: boolean;
  setConversationMenuOpen: (isOpen: boolean) => void;
  conversationMenuItems: ConversationMenuItem[];
  handleConversationMenuAction: (actionId: string) => void;
  sectionLabel?: string;
};

export function ChatHeader(props: Props) {
  const {
    selectedConversation,
    handleOpenCallDialog,
    isConversationMenuOpen,
    setConversationMenuOpen,
    conversationMenuItems,
    handleConversationMenuAction,
    sectionLabel,
  } = props;

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isConversationMenuOpen) {
      return;
    }
    const handleDocumentClick = (event: MouseEvent) => {
      if (menuRef.current?.contains(event.target as Node)) {
        return;
      }
      setConversationMenuOpen(false);
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [isConversationMenuOpen, setConversationMenuOpen]);

  const titleLabel = selectedConversation
    ? selectedConversation.conversationId
    : "No conversation selected";

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <div>
        <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-500">
          Active conversation
        </p>
        <div className="flex items-center gap-3 pt-1">
          <p className="text-lg font-semibold text-zinc-900">{titleLabel}</p>
          {sectionLabel && (
            <span className="rounded-full border border-emerald-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600">
              {sectionLabel}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        {selectedConversation && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-500"
              onClick={() => handleOpenCallDialog("voice")}
              aria-label="Start a voice call"
              title="Start a voice call"
            >
              <FiPhone />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-500"
              onClick={() => handleOpenCallDialog("video")}
              aria-label="Start a video call"
              title="Start a video call"
            >
              <FiVideo />
            </button>
            <div className="relative">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-500"
                onClick={() => setConversationMenuOpen((prev) => !prev)}
                aria-label="Open conversation menu"
              >
                <FiMoreVertical />
              </button>
              {isConversationMenuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 top-full mt-3 w-52 rounded-2xl border border-zinc-200 bg-white shadow-2xl"
                >
                  <div className="space-y-1 p-2">
                    {conversationMenuItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="flex w-full items-center justify-between rounded-2xl border border-transparent bg-zinc-50 px-3 py-2 text-left text-xs font-semibold text-zinc-700 transition hover:border-zinc-200"
                        onClick={() => handleConversationMenuAction(item.id)}
                      >
                        <span>{item.label}</span>
                        {item.id === "select-messages" && (
                          <FiCheck className="text-sm text-zinc-400" />
                        )}
                        {item.id === "search-messages" && (
                          <FiSearch className="text-sm text-zinc-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="text-right text-[11px] text-zinc-500">
        {selectedConversation && (
          <p>
            Last message{" "}
            {formatTimestamp(selectedConversation.lastMessageAt) ?? "-"}
          </p>
        )}
      </div>
    </header>
  );
}
