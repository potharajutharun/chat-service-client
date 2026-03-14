"use client";

type Props = {
  feedback: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  status: string | null;
};

export function FeedbackView({ feedback, onChange, onSubmit, status }: Props) {
  return (
    <div className="flex h-full flex-col justify-center gap-6 p-8">
      <h2 className="text-2xl font-semibold text-blue-800">Send feedback</h2>
      <textarea
        className="h-40 w-full rounded-2xl border border-zinc-800  px-4 py-3 text-sm text-dark placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
        placeholder="Let us know what's on your mind..."
        value={feedback}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="button"
        className="w-full rounded-2xl border border-transparent bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
        onClick={onSubmit}
      >
        Send feedback
      </button>
      {status && <p className="text-sm text-emerald-300">{status}</p>}
    </div>
  );
}
