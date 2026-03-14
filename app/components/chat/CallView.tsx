"use client";
import type { ReactNode } from "react";
import { FiCalendar, FiLink, FiPlus, FiVideo } from "react-icons/fi";
import { FaLock } from "react-icons/fa";

export type CallHistoryEntry = {
  callId: string;
  title: string;
  statusLabel: string;
  dateLabel: string;
  timeLabel: string;
  type: "voice" | "video";
};

type TileAction = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
};

type Props = {
  recentCalls: CallHistoryEntry[];
  onStartCall: (type: "voice" | "video") => void;
  onCreateCallLink: () => void;
  onCallNumber: () => void;
  onScheduleCall: () => void;
};

export function CallView({
  onStartCall,
  onCreateCallLink,
  onCallNumber,
  onScheduleCall,
}: Props) {
  const tiles: TileAction[] = [
    {
      label: "Start call",
      icon: <FiVideo className="text-2xl" />,
      onClick: () => onStartCall("video"),
    },
    {
      label: "New call link",
      icon: <FiLink className="text-2xl" />,
      onClick: onCreateCallLink,
    },
    {
      label: "Call a number",
      icon: <FiPlus className="text-2xl" />,
      onClick: onCallNumber,
    },
    {
      label: "Schedule call",
      icon: <FiCalendar className="text-2xl" />,
      onClick: onScheduleCall,
    },
  ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden p-6">
      <div className="flex flex-wrap justify-center gap-4">
        {tiles.map((tile) => (
          <button
            key={tile.label}
            type="button"
            className="flex min-w-[200px] flex-col items-center justify-center gap-3 rounded-3xl border border-zinc-200 px-6 py-8 text-center text-sm font-semibold text-zinc-900 transition hover:border-emerald-400"
            onClick={tile.onClick}
          >
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-600">
              {tile.icon}
            </div>
            <span>{tile.label}</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-zinc-500 flex items-center justify-center gap-2">
        <FaLock className="text-xs" />
        Your calls are end-to-end encrypted
      </p>
    </div>
  );
}

export type { Props as CallViewProps };
