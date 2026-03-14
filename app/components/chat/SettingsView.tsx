"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  FiBell,
  FiChevronRight,
  FiCommand,
  FiHelpCircle,
  FiKey,
  FiLogOut,
  FiMessageSquare,
  FiMonitor,
  FiShield,
  FiVideo,
  FiSearch,
} from "react-icons/fi";

type SettingsProfile = {
  name: string;
  status: string;
  avatarUrl: string;
};

type SettingsSection = {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
};

export type SettingsViewProps = {
  profile: SettingsProfile;
  onLogout: () => void;
};

const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: "general",
    label: "General",
    description: "Startup and close",
    icon: <FiMonitor />,
  },
  {
    id: "account",
    label: "Account",
    description: "Security notifications, account info",
    icon: <FiKey />,
  },
  {
    id: "privacy",
    label: "Privacy",
    description: "Blocked contacts, disappearing messages",
    icon: <FiShield />,
  },
  {
    id: "chats",
    label: "Chats",
    description: "Theme, wallpaper, chat settings",
    icon: <FiMessageSquare />,
  },
  {
    id: "video",
    label: "Video & voice",
    description: "Camera, microphone & speakers",
    icon: <FiVideo />,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Message notifications",
    icon: <FiBell />,
  },
  {
    id: "shortcuts",
    label: "Keyboard shortcuts",
    description: "Quick actions",
    icon: <FiCommand />,
  },
  {
    id: "help",
    label: "Help and feedback",
    description: "Help centre, contact us, privacy policy",
    icon: <FiHelpCircle />,
  },
];

export function SettingsView({ profile, onLogout }: SettingsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredSections = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return SETTINGS_SECTIONS;
    }
    return SETTINGS_SECTIONS.filter((section) =>
      section.label.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-1 flex-col bg-[#f7f7f5] p-6">
      <div className="rounded-3xl border border-zinc-200 bg-white px-6 py-7 shadow-md">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900">Settings</h1>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
            <FiSearch />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search settings"
              className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 border-b border-zinc-200 pb-6">
          <img
            src={profile.avatarUrl}
            alt={`${profile.name} avatar`}
            className="h-14 w-14 rounded-full border border-zinc-200 object-cover"
          />
          <div>
            <p className="text-xl font-semibold text-zinc-900">{profile.name}</p>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
              {profile.status}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {filteredSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left transition hover:border-emerald-300"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-lg text-emerald-500">
                  {section.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {section.label}
                  </p>
                  <p className="text-xs text-zinc-500">{section.description}</p>
                </div>
              </div>
              <FiChevronRight className="text-zinc-400" />
            </button>
          ))}
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-4">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-2xl border border-rose-500 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
            onClick={onLogout}
          >
            <span className="flex items-center gap-2">
              <FiLogOut />
              Log out
            </span>
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
