"use client";

import type { ReactNode } from "react";
import {
  FiArchive,
  FiFileText,
  FiImage,
  FiMessageSquare,
  FiPhone,
  FiSend,
  FiSettings,
} from "react-icons/fi";

export type Section =
  | "calls"
  | "chats"
  | "archived"
  | "notes"
  | "media"
  | "feedback"
  | "settings";

type NavItem = {
  id: Section;
  label: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  
  { id: "chats", label: "Chats", icon: <FiMessageSquare /> },
  { id: "calls", label: "Calls", icon: <FiPhone /> },
  { id: "archived", label: "Archived", icon: <FiArchive /> },
  { id: "notes", label: "Notes", icon: <FiFileText /> },
  { id: "media", label: "Media", icon: <FiImage /> },
  { id: "feedback", label: "Feedback", icon: <FiSend /> },
  { id: "settings", label: "Settings", icon: <FiSettings /> },
];

type Props = {
  activeSection: Section;
  onSelect: (section: Section) => void;
};

export function SideNav({ activeSection, onSelect }: Props) {
  return (
    <nav className="flex h-full w-20 flex-col justify-between border-r border-zinc-200 bg-white/90 shadow-sm">
      <div>
        
        <div className="flex flex-col items-center gap-1 px-1 py-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className="flex w-full flex-col items-center gap-1"
                onClick={() => onSelect(item.id)}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-lg transition ${
                    isActive
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                      : "border-transparent bg-white text-zinc-500 hover:border-zinc-200 hover:text-zinc-800"
                  }`}
                >
                  {item.icon}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="px-3 py-4">
          
          <div className="mt-4 flex items-center justify-between gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=60"
              alt="Profile"
              className="h-12 w-12 rounded-full border border-zinc-200 object-cover"
            />
          </div>
        </div>
    </nav>
  );
}
