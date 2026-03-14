"use client";

import { CallRecord } from "@/app/services/workspaceService";

type Props = {
  history: CallRecord[];
};

export function CallHistory({ history }: Props) {
  if (!history.length) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
        <p className="text-sm font-semibold text-white">Call history</p>
        <p className="text-xs text-zinc-400">No calls logged yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
      <p className="text-sm font-semibold text-white">Call history</p>
      <div className="mt-3 space-y-3">
        {history.map((entry) => (
          <div
            key={entry.callId}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-white"
          >
            <div>
              <p className="font-semibold text-white">{entry.type} call</p>
              <p className="text-xs text-zinc-400">
                {new Date(entry.startedAt).toLocaleString()} ·{" "}
                {entry.status} · {entry.participants.length} participants
              </p>
            </div>
            <p className="text-xs text-zinc-500">
              {Math.floor(entry.durationSeconds / 60)}m{" "}
              {entry.durationSeconds % 60}s
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
