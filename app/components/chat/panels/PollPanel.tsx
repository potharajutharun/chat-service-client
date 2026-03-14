"use client";

import type { FormEvent } from "react";
import { FloatingPanel } from "@/app/components/ui/FloatingPanel";

type Props = {
  open: boolean;
  pollQuestion: string;
  pollOptions: string[];
  onPollQuestionChange: (value: string) => void;
  onPollOptionChange: (index: number, value: string) => void;
  onAddPollOption: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export function PollPanel({
  open,
  pollQuestion,
  pollOptions,
  onPollQuestionChange,
  onPollOptionChange,
  onAddPollOption,
  onSubmit,
  onClose,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <FloatingPanel
      open={open}
      title="Create poll"
      subtitle="Let others vote in your chat"
      categoryLabel="Attachment"
      widthClassName="max-w-md"
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1 text-sm">
          <label className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            Question
          </label>
          <input
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
            placeholder="Ask something"
            value={pollQuestion}
            onChange={(event) => onPollQuestionChange(event.target.value)}
          />
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            Options
          </p>
          {pollOptions.map((option, index) => (
            <input
              key={`poll-option-${index}`}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(event) => onPollOptionChange(index, event.target.value)}
            />
          ))}
          <button
            type="button"
            className="text-xs font-semibold text-emerald-300 transition hover:text-emerald-200"
            onClick={onAddPollOption}
          >
            + Add another option
          </button>
        </div>
        <button
          type="submit"
          className="w-full rounded-2xl border border-transparent bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
        >
          Create poll
        </button>
      </form>
    </FloatingPanel>
  );
}
