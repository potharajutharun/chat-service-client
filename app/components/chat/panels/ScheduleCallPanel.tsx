"use client";

import { FiClock, FiPhone, FiVideo } from "react-icons/fi";
import type { FormEvent } from "react";
import { FloatingPanel } from "@/app/components/ui/FloatingPanel";

type Props = {
  open: boolean;
  eventTitle: string;
  eventDescription: string;
  eventStartDate: string;
  eventStartTime: string;
  eventEndDate: string;
  eventEndTime: string;
  eventHasEndTime: boolean;
  eventCallType: "video" | "voice";
  setEventTitle: (value: string) => void;
  setEventDescription: (value: string) => void;
  setEventStartDate: (value: string) => void;
  setEventStartTime: (value: string) => void;
  setEventEndDate: (value: string) => void;
  setEventEndTime: (value: string) => void;
  setEventHasEndTime: (value: boolean) => void;
  setEventCallType: (value: "video" | "voice") => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export function ScheduleCallPanel({
  open,
  eventTitle,
  eventDescription,
  eventStartDate,
  eventStartTime,
  eventEndDate,
  eventEndTime,
  eventHasEndTime,
  eventCallType,
  setEventTitle,
  setEventDescription,
  setEventStartDate,
  setEventStartTime,
  setEventEndDate,
  setEventEndTime,
  setEventHasEndTime,
  setEventCallType,
  onSubmit,
  onClose,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <FloatingPanel
      open={open}
      title="Schedule call"
      subtitle="Create a secure meeting link"
      categoryLabel="Call"
      widthClassName="max-w-lg"
      onClose={onClose}
    >
      <form className="space-y-4 text-sm text-zinc-600" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.5em] text-zinc-400">
            Call name
          </label>
          <input
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-emerald-400 focus:outline-none"
            placeholder="Enter a call title"
            value={eventTitle}
            onChange={(event) => setEventTitle(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.5em] text-zinc-400">
            Description (optional)
          </label>
          <textarea
            className="h-24 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-emerald-400 focus:outline-none"
            placeholder="Add context, agenda or guest instructions"
            value={eventDescription}
            onChange={(event) => setEventDescription(event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.5em] text-zinc-400">
                Start date & time
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-emerald-400 focus:outline-none"
                value={eventStartDate}
                onChange={(event) => setEventStartDate(event.target.value)}
              />
              <input
                type="time"
                className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-emerald-400 focus:outline-none"
                value={eventStartTime}
                onChange={(event) => setEventStartTime(event.target.value)}
              />
            </div>
          </div>
          {eventHasEndTime ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-[0.5em] text-zinc-400">
                  End date & time
                </label>
                <button
                  type="button"
                  className="flex items-center gap-1 text-[10px] font-semibold text-rose-500 hover:text-rose-400"
                  onClick={() => setEventHasEndTime(false)}
                >
                  <FiClock />
                  Remove end time
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="date"
                  className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-emerald-400 focus:outline-none"
                  value={eventEndDate}
                  onChange={(event) => setEventEndDate(event.target.value)}
                />
                <input
                  type="time"
                  className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-emerald-400 focus:outline-none"
                  value={eventEndTime}
                  onChange={(event) => setEventEndTime(event.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.5em] text-zinc-400">
                End date & time
              </label>
              <button
                type="button"
                className="text-xs font-semibold text-emerald-500 hover:text-emerald-400"
                onClick={() => setEventHasEndTime(true)}
              >
                + Add end time
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400">
            Call type
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                eventCallType === "video"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
              }`}
              onClick={() => setEventCallType("video")}
            >
              <FiVideo />
              Video
            </button>
            <button
              type="button"
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                eventCallType === "voice"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
              }`}
              onClick={() => setEventCallType("voice")}
            >
              <FiPhone />
              Voice
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white shadow transition hover:bg-emerald-400"
        >
          Schedule call
        </button>
      </form>
    </FloatingPanel>
  );
}
