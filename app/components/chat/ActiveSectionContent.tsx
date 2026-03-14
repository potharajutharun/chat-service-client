"use client";

import type { Section } from "@/app/components/ui/SideNav";
import { ChatWorkspace, type ChatWorkspaceProps } from "./ChatWorkspace";
import { CallView, type CallViewProps, type CallHistoryEntry } from "./CallView";
import NotesPage  from "@/app/components/notes/NotesPage";
import { ConversationBuilderPage } from "./ConversationBuilderPage";
import { MediaView } from "./MediaView";
import { FeedbackView } from "./FeedbackView";
import { SettingsView, type SettingsViewProps } from "./SettingsView";
import type { TenantUser } from "@/app/services/userService";
import type { Note } from "@/app/services/workspaceService";

type NotesViewProps = {
  notes: Note[];
  users: TenantUser[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  onSaveNote: (content: string) => void;
  onBack: () => void;
  onDeleteNote: (noteId: string) => void;
  externalCreateRequest: boolean;
  onExternalCreateHandled: () => void;
};

type ConversationBuilderProps = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  onSearch: () => void;
  filteredUsers: TenantUser[];
  selectedUserIds: number[];
  toggleUserSelection: (userId: number) => void;
  onDirectConversation: (userId: number) => void;
  onCreateGroup: () => void;
  isCreating: boolean;
  isLoadingUsers: boolean;
  usersError: string | null;
  onClose: () => void;
};

type FeedbackProps = {
  feedback: string;
  status: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

type ActiveSectionContentProps = {
  activeSection: Section;
  viewMode: "chat" | "notes" | "conversation";
  notesViewProps: NotesViewProps;
  conversationBuilderProps: ConversationBuilderProps;
  feedbackProps: FeedbackProps;
  chatWorkspaceProps: ChatWorkspaceProps;
  callViewProps: CallViewProps & {
    recentCalls: CallHistoryEntry[];
  };
  settingsProps: SettingsViewProps;
};

export function ActiveSectionContent({
  activeSection,
  viewMode,
  notesViewProps,
  conversationBuilderProps,
  feedbackProps,
  chatWorkspaceProps,
  callViewProps,
  settingsProps,
}: ActiveSectionContentProps) {
  const isSettingsSection = activeSection === "settings";
  const isNotesSection = activeSection === "notes";
  const isMediaSection = activeSection === "media";
  const isFeedbackSection = activeSection === "feedback";
  const isCallSection = activeSection === "calls";
  const isConversationBuilder = viewMode === "conversation";

  return (
    <section className="relative flex flex-1 flex-col overflow-hidden min-h-0 bg-[#f8f5f1]">
      {isSettingsSection ? (
        <SettingsView {...settingsProps} />
      ) : isNotesSection ? (
      <NotesPage/>
      ) : isConversationBuilder ? (
        <ConversationBuilderPage
          searchInput={conversationBuilderProps.searchInput}
          setSearchInput={conversationBuilderProps.setSearchInput}
          onSearch={conversationBuilderProps.onSearch}
          filteredUsers={conversationBuilderProps.filteredUsers}
          selectedUserIds={conversationBuilderProps.selectedUserIds}
          toggleUserSelection={conversationBuilderProps.toggleUserSelection}
          onDirectConversation={conversationBuilderProps.onDirectConversation}
          onCreateGroup={conversationBuilderProps.onCreateGroup}
          isCreating={conversationBuilderProps.isCreating}
          isLoadingUsers={conversationBuilderProps.isLoadingUsers}
          usersError={conversationBuilderProps.usersError}
          onClose={conversationBuilderProps.onClose}
        />
      ) : isMediaSection ? (
        <MediaView />
      ) : isFeedbackSection ? (
        <FeedbackView
          feedback={feedbackProps.feedback}
          onChange={feedbackProps.onChange}
          onSubmit={feedbackProps.onSubmit}
          status={feedbackProps.status}
        />
      ) : isCallSection ? (
        <CallView {...callViewProps} />
      ) : (
        <ChatWorkspace {...chatWorkspaceProps} />
      )}
    </section>
  );
}
