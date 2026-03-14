"use client";

import { TenantUser } from "@/app/services/userService";

type Props = {
  open: boolean;
  onClose: () => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
  onSearch: () => void;
  filteredUsers: TenantUser[];
  selectedUserIds: number[];
  toggleUserSelection: (userId: number) => void;
  onDirectConversation: (userId: number) => void;
  onCreateGroup: () => void;
  isCreating: boolean;
  isLoadingUsers: boolean;
  usersError: string | null;
};

const displayName = (user: TenantUser) =>
  user.name ??
  [user.firstName, user.lastName].filter(Boolean).join(" ") ??
  user.email ??
  `User ${user.id}`;

export function UserPickerOverlay({
  open,
  onClose,
  searchInput,
  setSearchInput,
  onSearch,
  filteredUsers,
  selectedUserIds,
  toggleUserSelection,
  onDirectConversation,
  onCreateGroup,
  isCreating,
  isLoadingUsers,
  usersError,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-stretch justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-3xl flex-col gap-4 rounded-3xl bg-zinc-950 p-6 shadow-2xl shadow-black/50"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-zinc-400">New conversation</p>
            <p className="text-xs text-zinc-500">Search users or build a group</p>
          </div>
          <button
            type="button"
            className="text-xl font-bold text-zinc-400 transition hover:text-white"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-2xl border border-zinc-700 bg-black/40 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            placeholder="Search by name or email"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <button
            type="button"
            className="rounded-2xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
            onClick={onSearch}
          >
            Search
          </button>
        </div>
        <button
          type="button"
          className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          onClick={onCreateGroup}
          disabled={selectedUserIds.length < 2 || isCreating}
        >
          {isCreating ? "Working..." : "Create group chat"}
        </button>
        <div className="flex-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-black/20 p-3">
          {isLoadingUsers && (
            <p className="text-xs text-amber-300">Loading users…</p>
          )}
          {usersError && (
            <p className="text-xs text-rose-300">{usersError}</p>
          )}
          {!filteredUsers.length && !isLoadingUsers && (
            <p className="text-xs text-zinc-500">No users found.</p>
          )}
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-2xl border border-transparent bg-white/5 px-3 py-2 transition hover:border-white/30"
              >
                <label className="flex items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-zinc-600 bg-black/60"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                  />
                  <span>{displayName(user)}</span>
                </label>
                <button
                  type="button"
                  className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-400"
                  onClick={() => onDirectConversation(user.id)}
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
