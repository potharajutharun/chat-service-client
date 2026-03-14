"use client";

const mediaItems = [
  { label: "Photos", count: 24 },
  { label: "Documents", count: 8 },
  { label: "Links", count: 12 },
];

export function MediaView() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <p className="text-lg font-semibold text-blue-800">Shared media</p>
      <div className="flex gap-4">
        {mediaItems.map((item) => (
          <div
            key={item.label}
            className="flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 text-center"
          >
            <p className="text-sm font-semibold text-zinc-300">{item.label}</p>
            <p className="text-2xl font-bold text-white">{item.count}</p>
          </div>
        ))}
      </div>
      <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
        Organize media here
      </p>
    </div>
  );
}
