"use client";

import type { FormEvent, Ref } from "react";
import type { Conversation, Message } from "@/app/types/chat";
import { ChatHeader, type ConversationMenuItem } from "./ChatHeader";
import { MessageThread } from "./MessageThread";
import { MessageComposer, type AttachmentAction } from "./MessageComposer";
import type { TenantUser } from "@/app/services/userService";

type Props = {
  selectedConversation: Conversation | null;
  messages: Message[];
  loadingMessages: boolean;
  messageError: string | null;
  userId: number;
  selectedConversationId: string | null;
  paneRef: Ref<HTMLDivElement>;
  users: TenantUser[];
  formatSenderLabel: (senderId: number) => string;
  messageText: string;
  onMessageChange: (value: string) => void;
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void;
  onMarkAsRead: () => void;
  isSending: boolean;
  isMarkingRead: boolean;
  actionInfo: string | null;
  hasMessages: boolean;
  attachmentActions: AttachmentAction[];
  isAttachmentMenuOpen: boolean;
  onAttachmentToggle: () => void;
  onAttachmentAction: (actionId: string) => void;
  isConversationMenuOpen: boolean;
  setConversationMenuOpen: (isOpen: boolean) => void;
  conversationMenuItems: ConversationMenuItem[];
  handleConversationMenuAction: (actionId: string) => void;
  handleOpenCallDialog: (type: "voice" | "video") => void;
  sectionLabel?: string;
};

export function ChatWorkspace({
  selectedConversation,
  messages,
  loadingMessages,
  messageError,
  userId,
  selectedConversationId,
  paneRef,
  users,
  formatSenderLabel,
  messageText,
  onMessageChange,
  onSendMessage,
  onMarkAsRead,
  isSending,
  isMarkingRead,
  actionInfo,
  hasMessages,
  attachmentActions,
  isAttachmentMenuOpen,
  onAttachmentToggle,
  onAttachmentAction,
  isConversationMenuOpen,
  setConversationMenuOpen,
  conversationMenuItems,
  handleConversationMenuAction,
  handleOpenCallDialog,
  sectionLabel,
}: Props) {
  return (
    <div className="flex flex-1 flex-col bg-[#fefefe] shadow-inner">
      <ChatHeader
        selectedConversation={selectedConversation}
        handleOpenCallDialog={handleOpenCallDialog}
        isConversationMenuOpen={isConversationMenuOpen}
        setConversationMenuOpen={setConversationMenuOpen}
        conversationMenuItems={conversationMenuItems}
        handleConversationMenuAction={handleConversationMenuAction}
        sectionLabel={sectionLabel}
      />
      <div className="flex-1 overflow-hidden bg-[#faf7f4]">
        <MessageThread
          messages={messages}
          loading={loadingMessages}
          error={messageError}
          userId={userId}
          selectedConversationId={selectedConversationId}
          paneRef={paneRef}
          users={users}
          formatSenderLabel={formatSenderLabel}
        />
      </div>
      <MessageComposer
        messageText={messageText}
        onChange={onMessageChange}
        onSubmit={onSendMessage}
        onMarkAsRead={onMarkAsRead}
        isDisabled={!selectedConversationId}
        isSending={isSending}
        isMarkingRead={isMarkingRead}
        hasMessages={hasMessages}
        actionInfo={actionInfo}
        attachmentActions={attachmentActions}
        isAttachmentMenuOpen={isAttachmentMenuOpen}
        onAttachmentToggle={onAttachmentToggle}
        onAttachmentAction={onAttachmentAction}
      />
    </div>
  );
}

export type { Props as ChatWorkspaceProps };
