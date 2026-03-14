import type { Conversation, Message } from "@/app/types/chat";
import mockConversations from "@/mock-data/conversations.json";
import mockMessages from "@/mock-data/messages.json";

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

const handleResponse = async <T>(
  response: Response,
  { parseJson = true } = {},
): Promise<T> => {
  if (!response.ok) {
    const text = (await response.text()) || response.statusText;
    throw new Error(text);
  }
  if (!parseJson) {
    return undefined as unknown as T;
  }
  return (await response.json()) as T;
};

const withFallback = async <T>(fn: () => Promise<T>, fallback: T, label: string) => {
  try {
    return await fn();
  } catch (error) {
    console.warn(`API fallback triggered for ${label}:`, error);
    return fallback;
  }
};

export const fetchConversations = async (
  userId: number,
  token?: string,
): Promise<Conversation[]> => {
  return withFallback(
    async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/conversations/user/${userId}`,
        {
          headers: buildHeaders(token),
          cache: "no-store",
        },
      );
      return handleResponse<Conversation[]>(response);
    },
    mockConversations as Conversation[],
    "fetchConversations",
  );
};

export const fetchMessages = async (
  conversationId: string,
  token?: string,
): Promise<Message[]> => {
  return withFallback(
    async () => {
      const response = await fetch(`${API_BASE_URL}/api/messages/${conversationId}`, {
        headers: buildHeaders(token),
        cache: "no-store",
      });
      return handleResponse<Message[]>(response);
    },
    mockMessages as Message[],
    "fetchMessages",
  );
};

type CreateConversationArgs = {
  tenantId: number;
  memberIds: number[];
  isGroup: boolean;
  name: string;
};

export const createConversation = async (
  payload: CreateConversationArgs,
  token?: string,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/conversations`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });
  await handleResponse<void>(response, { parseJson: false });
};

type SendMessageArgs = {
  conversationId: string;
  senderId: number;
  tenantId: number;
  messageText: string;
  messageType: string;
};

export const sendMessage = async (
  payload: SendMessageArgs,
  token?: string,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/messages`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });
  await handleResponse<void>(response, { parseJson: false });
};

type MarkReadArgs = {
  messageId: string;
  userId: number;
};

export const markMessageRead = async (
  payload: MarkReadArgs,
  token?: string,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/messages/read`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });
  await handleResponse<void>(response, { parseJson: false });
};
