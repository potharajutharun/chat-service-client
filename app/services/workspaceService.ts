import mockCallHistory from "@/mock-data/call-history.json";
import mockNotes from "@/mock-data/notes.json";
import mockTasks from "@/mock-data/task-list.json";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL ?? "http://localhost:5270";

const buildHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const withFallback = async <T>(fn: () => Promise<T>, fallback: T, label: string) => {
  try {
    return await fn();
  } catch (error) {
    console.warn(`Workspace service fallback for ${label}:`, error);
    return fallback;
  }
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const text = (await response.text()) || response.statusText;
    throw new Error(text);
  }
  return (await response.json()) as T;
};

export type CallRecord = {
  callId: string;
  type: "voice" | "video";
  startedAt: string;
  durationSeconds: number;
  participants: number[];
  status: "completed" | "missed" | "ongoing";
};

export type Task = {
  taskId: string;
  title: string;
  description: string;
  dueDate: string;
  assigneeId?: number;
  status: "open" | "in-progress" | "done";
};

export type Note = {
  noteId: string;
  content: string;
  createdAt: string;
  authorId: number;
  title?: string;
  description?: string;
  collaborators?: string[];
  imageUrl?: string;
};

type StartCallPayload = {
  type: "voice" | "video";
  participantIds: number[];
};

type CreateTaskPayload = {
  title: string;
  description: string;
  dueDate?: string;
  assigneeId?: number;
};

type AssignTaskPayload = {
  taskId: string;
  assigneeId: number;
};

export type SaveNotePayload = {
  content: string;
  title?: string;
  description?: string;
  collaborators?: string[];
  imageUrl?: string;
};

export const fetchCallHistory = async (token?: string): Promise<CallRecord[]> => {
  return withFallback(
    async () => {
      const response = await fetch(`${API_BASE_URL}/api/calls/history`, {
        headers: buildHeaders(token),
        cache: "no-store",
      });
      return await handleResponse<CallRecord[]>(response);
    },
    mockCallHistory as CallRecord[],
    "fetchCallHistory",
  );
};

export const startCall = async (
  payload: StartCallPayload,
  token?: string,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/calls/start`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = (await response.text()) || response.statusText;
    throw new Error(text);
  }
};

export const fetchTasks = async (token?: string): Promise<Task[]> => {
  return withFallback(
    async () => {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        headers: buildHeaders(token),
        cache: "no-store",
      });
      return await handleResponse<Task[]>(response);
    },
    mockTasks as Task[],
    "fetchTasks",
  );
};

export const createTask = async (
  payload: CreateTaskPayload,
  token?: string,
): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<Task>(response);
};

export const assignTask = async (
  payload: AssignTaskPayload,
  token?: string,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${payload.taskId}/assign`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify({ assigneeId: payload.assigneeId }),
  });
  if (!response.ok) {
    const text = (await response.text()) || response.statusText;
    throw new Error(text);
  }
};

export const fetchNotes = async (token?: string): Promise<Note[]> => {
  return withFallback(
    async () => {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        headers: buildHeaders(token),
        cache: "no-store",
      });
      return await handleResponse<Note[]>(response);
    },
    mockNotes as Note[],
    "fetchNotes",
  );
};

export const saveNote = async (
  payload: SaveNotePayload,
  token?: string,
): Promise<Note> => {
  const response = await fetch(`${API_BASE_URL}/api/notes`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<Note>(response);
};

export const uploadFile = async (
  formData: FormData,
  token?: string,
): Promise<{ fileId: string; fileName: string; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/files`, {
    method: "POST",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
    body: formData,
  });
  return handleResponse<{ fileId: string; fileName: string; message: string }>(
    response,
  );
};
