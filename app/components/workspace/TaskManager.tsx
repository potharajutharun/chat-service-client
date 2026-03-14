"use client";

import { FormEvent, useState } from "react";
import type { Task } from "@/app/services/workspaceService";
import type { TenantUser } from "@/app/services/userService";

type Props = {
  tasks: Task[];
  availableUsers: TenantUser[];
  onCreateTask: (
    payload: { title: string; description: string; dueDate?: string; assigneeId?: number },
  ) => Promise<void>;
  onAssignTask: (taskId: string, assigneeId: number) => Promise<void>;
  isProcessing: boolean;
  statusMessage: string | null;
};

export function TaskManager({
  tasks,
  availableUsers,
  onCreateTask,
  onAssignTask,
  isProcessing,
  statusMessage,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState<number | undefined>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    await onCreateTask({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || undefined,
      assigneeId,
    });
    setTitle("");
    setDescription("");
    setDueDate("");
    setAssigneeId(undefined);
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
      <p className="text-sm font-semibold text-white">Task manager</p>
      <form className="mt-3 space-y-2" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
          className="w-full rounded-xl border border-zinc-700 bg-black/30 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        />
        <textarea
          rows={2}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
          className="w-full rounded-xl border border-zinc-700 bg-black/30 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="rounded-xl border border-zinc-700 bg-black/30 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
          />
          <select
            value={assigneeId ?? ""}
            onChange={(event) =>
              setAssigneeId(event.target.value ? Number(event.target.value) : undefined)
            }
            className="rounded-xl border border-zinc-700 bg-black/30 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">Assign to</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name ?? user.email ?? `User ${user.id}`}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded-2xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500/50"
          disabled={!title.trim() || isProcessing}
        >
          {isProcessing ? "Saving…" : "Create task"}
        </button>
      </form>
      <div className="mt-4 space-y-2">
        {tasks.map((task) => (
          <div
            key={task.taskId}
            className="rounded-2xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">{task.title}</p>
              <span className="text-xs text-zinc-500">{task.status}</span>
            </div>
            <p className="text-xs text-zinc-400">{task.description}</p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span>Due {task.dueDate}</span>
              <select
                value={task.assigneeId ?? ""}
                onChange={(event) => {
                  if (!event.target.value) return;
                  onAssignTask(task.taskId, Number(event.target.value));
                }}
                className="rounded-full border border-zinc-700 bg-zinc-900/50 px-2 py-1 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Assign</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name ?? user.email ?? `User ${user.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
      {statusMessage && (
        <p className="mt-3 text-xs text-zinc-300">{statusMessage}</p>
      )}
    </section>
  );
}
