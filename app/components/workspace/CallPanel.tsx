"use client";

import { useMemo, useState } from "react";
import type { TenantUser } from "@/app/services/userService";

type Props = {
  availableUsers: TenantUser[];
  onStartCall: (type: "voice" | "video", participants: number[]) => Promise<void>;
  isStartingCall: boolean;
  statusMessage: string | null;
};

export function CallPanel({
  availableUsers,
  onStartCall,
  isStartingCall,
  statusMessage,
}: Props) {
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

  const toggleParticipant = (id: number) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  const canStart = selectedParticipants.length > 0 && !isStartingCall;
  const participantLabel = useMemo(
    () =>
      selectedParticipants.length
        ? `${selectedParticipants.length} selected`
        : "Select at least one participant",
    [selectedParticipants],
  );

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
      <p className="text-sm font-semibold text-white">Voice & video calls</p>
      <p className="text-xs text-zinc-400">{participantLabel}</p>
      <div className="mt-3 space-y-2">
        {availableUsers.map((user) => (
          <label
            key={user.id}
            className="flex items-center gap-2 rounded-xl border border-transparent bg-white/5 px-3 py-2 text-sm text-white transition hover:border-white/30"
          >
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-600"
              checked={selectedParticipants.includes(user.id)}
              onChange={() => toggleParticipant(user.id)}
            />
            <span>{user.name ?? user.email ?? `User ${user.id}`}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-2xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/50"
          disabled={!canStart}
          onClick={() => onStartCall("voice", selectedParticipants)}
        >
          {isStartingCall ? "Calling…" : "Start voice call"}
        </button>
        <button
          type="button"
          className="flex-1 rounded-2xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500/50"
          disabled={!canStart}
          onClick={() => onStartCall("video", selectedParticipants)}
        >
          {isStartingCall ? "Calling…" : "Start video call"}
        </button>
      </div>
      {statusMessage && (
        <p className="mt-3 text-xs text-zinc-300">{statusMessage}</p>
      )}
    </section>
  );
}
