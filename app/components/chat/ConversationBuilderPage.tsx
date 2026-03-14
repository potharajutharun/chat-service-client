"use client";

import { FiArrowLeft } from "react-icons/fi";
import type { TenantUser } from "@/app/services/userService";

type Props = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  filteredUsers: TenantUser[];
  selectedUserIds: number[];
  toggleUserSelection: (userId: number) => void;
  onStartConversation: () => void;
  isCreating: boolean;
  isLoadingUsers: boolean;
  usersError: string | null;
  onClose: () => void;
};

export function ConversationBuilderPage({
  searchInput,
  setSearchInput,
  filteredUsers,
  selectedUserIds,
  toggleUserSelection,
  onStartConversation,
  isCreating,
  isLoadingUsers,
  usersError,
  onClose,
}: Props) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden min-h-0">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-xl text-zinc-400 transition hover:border-white hover:text-white"
            onClick={onClose}
            aria-label="Back to chat"
          >
            <FiArrowLeft />
          </button>
          <div>
            <p className="text-[15px] text-blue-500">Conversations</p>
            <p className="text-lg font-semibold">Start a new chat</p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-2xl border border-blue-700 px-4 py-2 text-xs font-semibold text-blue-800 transition hover:bg-blue-700 hover:text-white disabled:border-zinc-500 disabled:text-zinc-500"
          onClick={onStartConversation}
          disabled={selectedUserIds.length === 0 || isCreating}
        >
          {selectedUserIds.length > 1
            ? isCreating
              ? "Creating…"
              : "Create group"
            : isCreating
            ? "Starting…"
            : "Start chat"}
        </button>
      </header>
      <div className="flex flex-1 flex-col overflow-y-auto p-6">
        <input
          className="w-full rounded-2xl border border-zinc-700 px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none"
          type="search"
          placeholder="Search users"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <div className="mt-4 space-y-3">
          {isLoadingUsers && (
            <p className="text-xs text-amber-300">Loading users…</p>
          )}
          {usersError && (
            <p className="text-xs text-rose-300">{usersError}</p>
          )}
        </div>
        <div className="mt-3 flex-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-black/20 p-3">
          {filteredUsers.length === 0 && !isLoadingUsers ? (
            <p className="text-xs text-zinc-500">No users found.</p>
          ) : (
            filteredUsers.map((user) => {
              const isSelected = selectedUserIds.includes(user.id);
              return (
                <div
                  key={user.id}
                  role="button"
                  tabIndex={0}
                  className={`mb-2 rounded-2xl border px-3 py-2 text-sm transition focus:outline-none ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-transparent text-white hover:border-white/30"
                  }`}
                  onClick={() => toggleUserSelection(user.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleUserSelection(user.id);
                    }
                  }}
                >
                  {user.name ?? user.email ?? `User ${user.id}`}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
