export type Conversation = {
  conversationId: string;
  lastMessageId?: string;
  lastMessageAt?: string;
  unreadCount?: number;
};

export type Message = {
  messageId: string;
  conversationId: string;
  senderId: number;
  messageText: string;
  messageType?: string;
  createdAt?: string;
};

export type AuthInfo = {
  userId: number;
  tenantId: number;
  token: string;
};
