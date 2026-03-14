"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FiBarChart2,
  FiCalendar,
  FiCamera,
  FiFileText,
  FiImage,
  FiUser,
} from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { ConversationSidebar, type SidebarMode } from "./components/chat/ConversationSidebar";
import type { AttachmentAction } from "./components/chat/MessageComposer";
import { ActiveSectionContent } from "./components/chat/ActiveSectionContent";
import { CallOverlay } from "./components/overlays/CallOverlay";
import {
  WorkspaceOverlay,
  type WorkspaceOverlayFocus,
} from "./components/overlays/WorkspaceOverlay";
import { AuthInfo, Conversation, Message } from "./types/chat";
import { ContactsPanel } from "./components/chat/panels/ContactsPanel";
import { MessageSearchPanel } from "./components/chat/panels/MessageSearchPanel";
import { PollPanel } from "./components/chat/panels/PollPanel";
import { ScheduleCallPanel } from "./components/chat/panels/ScheduleCallPanel";
import { StickersPanel } from "./components/chat/panels/StickersPanel";
import { formatDateLabel, formatTimestamp } from "./lib/format";
import { SideNav, type Section } from "./components/ui/SideNav";
import {
  createConversation,
  fetchConversations,
  fetchMessages,
  markMessageRead,
  sendMessage,
} from "./services/chatService";
import {
  fetchTenantUsers,
  TenantUser,
} from "./services/userService";
import {
  startCall,
  fetchCallHistory,
  fetchTasks,
  createTask,
  assignTask,
  uploadFile,
  fetchNotes,
  saveNote,
  CallRecord,
  Task,
  Note,
  SaveNotePayload,
} from "./services/workspaceService";

import { deriveAuthInfo, DEFAULT_USER_ID, DEFAULT_TENANT_ID } from "./lib/auth";

export default function Home() {
  const [auth, setAuth] = useState<AuthInfo>({
    userId: DEFAULT_USER_ID,
    tenantId: DEFAULT_TENANT_ID,
    token: "",
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [actionInfo, setActionInfo] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  const [tenantUsers, setTenantUsers] = useState<TenantUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [isTaskProcessing, setIsTaskProcessing] = useState(false);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [assignStatus, setAssignStatus] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [viewMode, setViewMode] = useState<"chat" | "notes" | "conversation">("chat");
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [isNotesSaving, setIsNotesSaving] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [callDialogMode, setCallDialogMode] = useState<"voice" | "video" | null>(null);
  const [isWorkspaceOverlayOpen, setIsWorkspaceOverlayOpen] = useState(false);
  const [workspaceOverlayFocus, setWorkspaceOverlayFocus] =
    useState<WorkspaceOverlayFocus | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("chats");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);
  const [isConversationMenuOpen, setIsConversationMenuOpen] = useState(false);
  const [isMessageSearchOpen, setIsMessageSearchOpen] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState("");
  const [searchSenderId, setSearchSenderId] = useState<number | null>(null);
  const closeMessageSearch = () => {
    setIsMessageSearchOpen(false);
    setMessageSearchQuery("");
    setSearchSenderId(null);
  };
  const [activeAttachmentPanel, setActiveAttachmentPanel] = useState<
    "stickers" | "poll" | "event" | "contacts" | null
  >(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [stickerLibrary, setStickerLibrary] = useState<string[]>([
    "\u{1F600}",
    "\u{1F389}",
    "\u{1F680}",
    "\u{2728}",
  ]);
  const [newStickerLabel, setNewStickerLabel] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const now = new Date();
  const initialStartDate = now.toISOString().slice(0, 10);
  const initialStartTime = now.toTimeString().slice(0, 5);
  const defaultEnd = new Date(now);
  defaultEnd.setMinutes(defaultEnd.getMinutes() + 30);
  const [eventStartDate, setEventStartDate] = useState(initialStartDate);
  const [eventStartTime, setEventStartTime] = useState(initialStartTime);
  const [eventEndDate, setEventEndDate] = useState(defaultEnd.toISOString().slice(0, 10));
  const [eventEndTime, setEventEndTime] = useState(defaultEnd.toTimeString().slice(0, 5));
  const [eventHasEndTime, setEventHasEndTime] = useState(true);
  const [eventCallType, setEventCallType] = useState<"video" | "voice">("video");
  const attachmentMenuActions = useMemo<AttachmentAction[]>(
    () => [
      {
        id: "document",
        label: "Document",
        description: "Attach a file from your device.",
        icon: <FiFileText className="text-xl text-amber-300" aria-hidden />,
      },
      {
        id: "photos",
        label: "Photos & videos",
        description: "Share a visual moment.",
        icon: <FiImage className="text-xl text-emerald-300" aria-hidden />,
      },
      {
        id: "camera",
        label: "Camera",
        description: "Snap a new image.",
        icon: <FiCamera className="text-xl text-sky-300" aria-hidden />,
      },
      {
        id: "stickers",
        label: "Stickers",
        description: "Browse and add stickers.",
        icon: <BsEmojiSmile className="text-xl text-rose-300" aria-hidden />,
      },
      {
        id: "contact",
        label: "Contact",
        description: "Send someone’s profile.",
        icon: <FiUser className="text-xl text-violet-300" aria-hidden />,
      },
      {
        id: "poll",
        label: "Poll",
        description: "Ask a quick question.",
        icon: <FiBarChart2 className="text-xl text-yellow-300" aria-hidden />,
      },
      {
        id: "event",
        label: "Event",
        description: "Schedule something.",
        icon: <FiCalendar className="text-xl text-orange-300" aria-hidden />,
      },
    ],
    [],
  );

  const messagePaneRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenWorkspaceOverlay = (
    focus: WorkspaceOverlayFocus | null = null,
  ) => {
    setWorkspaceOverlayFocus(focus);
    setIsWorkspaceOverlayOpen(true);
  };

  const handleCloseWorkspaceOverlay = () => {
    setIsWorkspaceOverlayOpen(false);
    setWorkspaceOverlayFocus(null);
  };


  const handleAttachmentAction = (actionId: string) => {
    const action = attachmentMenuActions.find((item) => item.id === actionId);
    if (!action) {
      return;
    }
    setIsAttachmentMenuOpen(false);
    const focusActions: Record<string, WorkspaceOverlayFocus> = {
      document: "files",
      photos: "files",
    };
    if (actionId === "document") {
      setActionInfo("Select a file from your device.");
      fileInputRef.current?.click();
      return;
    }

    if (actionId === "camera") {
      handleCameraCaptureClick();
      setActionInfo("Camera ready.");
      return;
    }

    if (actionId === "stickers") {
      setActiveAttachmentPanel("stickers");
      return;
    }

    if (actionId === "poll") {
      setActiveAttachmentPanel("poll");
      return;
    }

    if (actionId === "event") {
      setActiveAttachmentPanel("event");
      return;
    }

    if (actionId === "contact") {
      setActiveAttachmentPanel("contacts");
      return;
    }

    const focus = focusActions[actionId];
    if (focus) {
      handleOpenWorkspaceOverlay(focus);
      setActionInfo(`${action.label} ready in workspace.`);
    } else {
      setActionInfo(`${action.label} action ready (placeholder).`);
    }
    setIsAttachmentMenuOpen(false);
  };

  const conversationMenuItems = [
    { id: "group-info", label: "Group info" },
    { id: "select-messages", label: "Select messages" },
    { id: "mute-notifications", label: "Mute notifications" },
    { id: "disappearing-messages", label: "Disappearing messages" },
    { id: "add-to-favourites", label: "Add to favourites" },
    { id: "add-to-list", label: "Add to list" },
    { id: "close-chat", label: "Close chat" },
    { id: "clear-chat", label: "Clear chat" },
    { id: "exit-group", label: "Exit group" },
    { id: "search-messages", label: "Search user chat messages" },
  ];

  const handleConversationMenuAction = (actionId: string) => {
    setIsConversationMenuOpen(false);
    if (actionId === "search-messages") {
      if (!selectedConversation) {
        setActionInfo("Select a conversation before searching.");
        return;
      }
      setIsMessageSearchOpen(true);
      return;
    }
    const item = conversationMenuItems.find((menuItem) => menuItem.id === actionId);
    setActionInfo(`${item?.label ?? "Action"} is coming soon.`);
  };

  const loadNotes = useCallback(async () => {
    setIsNotesLoading(true);
    setNotesError(null);
    try {
      const data = await fetchNotes(auth.token);
      setNotes(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load notes.";
      setNotesError(message);
    } finally {
      setIsNotesLoading(false);
    }
  }, [auth.token]);

  const handleSaveNote = useCallback(
    async (payload: SaveNotePayload) => {
      setIsNotesSaving(true);
      setNotesError(null);
      try {
        const savedNote = await saveNote(payload, auth.token);
        setNotes((prev) => [
          { ...savedNote, ...payload },
          ...prev.filter((note) => note.noteId !== savedNote.noteId),
        ]);
        setActionInfo("Note saved.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to save note.";
        setNotesError(message);
      } finally {
        setIsNotesSaving(false);
      }
    },
    [auth.token],
  );

  const handleOpenNotes = () => {
    setActiveSection("notes");
    setViewMode("notes");
  };

  const handleCloseNotes = () => {
    setViewMode("chat");
    setActiveSection("chats");
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.noteId !== noteId));
    setActionInfo("Note deleted.");
  };

  const handleEditNote = useCallback((noteId: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.noteId === noteId ? { ...note, ...updates } : note,
      ),
    );
    setActionInfo("Note updated.");
  }, []);

  const handleOpenCallDialog = (type: "voice" | "video") => {
    setCallDialogMode(type);
  };

  const handleCloseCallDialog = () => {
    setCallDialogMode(null);
  };

  const handleSectionChange = (section: Section) => {
    if (section === "settings") {
      setActiveSection(section);
      setViewMode("chat");
      return;
    }
    if (section === "calls") {
      setActiveSection(section);
      setViewMode("chat");
      return;
    }
    setActiveSection(section);
    if (section === "notes") {
      setViewMode("notes");
      return;
    }
    if (section === "media" || section === "feedback") {
      setViewMode("chat");
      return;
    }
    if (section === "chats" || section === "archived") {
      if (viewMode !== "conversation") {
        setViewMode("chat");
      }
    }
  };

  useEffect(() => {
    setAuth(deriveAuthInfo());
  }, []);

  const refreshConversations = useCallback(async () => {
    if (!auth.userId) {
      return;
    }
    setIsLoadingConversations(true);
    setConversationError(null);
    try {
      const payload = await fetchConversations(auth.userId, auth.token);
      setConversations(payload);
      setSelectedConversationId((prev) =>
        prev && payload.some((item) => item.conversationId === prev)
          ? prev
          : payload[0]?.conversationId ?? null,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load conversations.";
      setConversationError(message);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [auth.userId, auth.token]);

  const loadMessages = useCallback(async () => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }
    setIsLoadingMessages(true);
    setMessageError(null);
    try {
      const payload = await fetchMessages(selectedConversationId, auth.token);
      setMessages(payload);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load messages.";
      setMessageError(message);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [selectedConversationId, auth.token]);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (viewMode !== "notes") {
      return;
    }
    loadNotes();
  }, [viewMode, loadNotes]);

  const formatUserName = useCallback(
    (user: TenantUser) =>
      user.name ??
      [user.firstName, user.lastName].filter(Boolean).join(" ") ??
      user.email ??
      `User ${user.id}`,
    [],
  );
  const formatSenderLabel = useCallback(
    (senderId: number) => {
      if (senderId === auth.userId) {
        return "You";
      }
      const user = tenantUsers.find((item) => item.id === senderId);
      if (user) {
        return formatUserName(user);
      }
      return `User ${senderId}`;
    },
    [auth.userId, formatUserName, tenantUsers],
  );

  const loadTenantUsers = useCallback(async () => {
    if (!auth.tenantId) {
      return;
    }
    setIsLoadingUsers(true);
    setUsersError(null);
    try {
      const users = await fetchTenantUsers(auth.tenantId, auth.token);
      const filtered = users.filter((user) => user.id !== auth.userId);
      setTenantUsers(filtered);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load users.";
      setUsersError(message);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [auth.tenantId, auth.token, auth.userId]);

  useEffect(() => {
    loadTenantUsers();
  }, [loadTenantUsers]);

  const filteredTenantUsers = useMemo(() => {
    const term = searchInput.trim().toLowerCase();
    if (!term) {
      return tenantUsers;
    }
    return tenantUsers.filter((user) =>
      formatUserName(user).toLowerCase().includes(term),
    );
  }, [searchInput, tenantUsers, formatUserName]);

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleOpenConversationPage = () => {
    setSearchInput("");
    setSelectedUserIds([]);
    setViewMode("conversation");
    setActiveSection("chats");
  };

  const handleCloseConversationPage = () => {
    setViewMode("chat");
    setSearchInput("");
    setSelectedUserIds([]);
  };

  const refreshCallHistory = useCallback(async () => {
    try {
      const data = await fetchCallHistory(auth.token);
      setCallHistory(data);
    } catch (error) {
      console.warn("Unable to refresh call history", error);
    }
  }, [auth.token]);

  const refreshTasks = useCallback(async () => {
    try {
      const items = await fetchTasks(auth.token);
      setTasks(items);
    } catch (error) {
      console.warn("Unable to refresh tasks", error);
    }
  }, [auth.token]);

  useEffect(() => {
    refreshCallHistory();
    refreshTasks();
  }, [refreshCallHistory, refreshTasks]);

  useEffect(() => {
    if (!isWorkspaceOverlayOpen) {
      return;
    }

    refreshCallHistory();
    refreshTasks();
  }, [isWorkspaceOverlayOpen, refreshCallHistory, refreshTasks]);

  useEffect(() => {
    if (messagePaneRef.current) {
      messagePaneRef.current.scrollTop = messagePaneRef.current.scrollHeight;
    }
  }, [messages, isLoadingMessages]);

  const filteredConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return conversations;
    }
    return conversations.filter((conversation) => {
      const haystack = `${conversation.conversationId} ${conversation.lastMessageId ?? ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [conversations, searchTerm]);

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.conversationId === selectedConversationId,
      ) ?? null,
    [conversations, selectedConversationId],
  );

  const messageSenderOptions = useMemo(() => {
    const senderIds = Array.from(new Set(messages.map((message) => message.senderId)));
    return senderIds
      .map((senderId) => ({
        senderId,
        label: formatSenderLabel(senderId),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [messages, formatSenderLabel]);

  const messageSearchResults = useMemo(() => {
    const term = messageSearchQuery.trim().toLowerCase();
    return messages
      .filter((message) => {
        if (searchSenderId && message.senderId !== searchSenderId) {
          return false;
        }
        if (!term) {
          return true;
        }
        return message.messageText.toLowerCase().includes(term);
      })
      .slice(0, 30);
  }, [messages, messageSearchQuery, searchSenderId]);

  const callHistoryEntries = useMemo(() => {
    return callHistory
      .map((call) => {
        const otherParticipant =
          call.participants.find((participant) => participant !== auth.userId) ??
          call.participants[0] ??
          auth.userId;
        const statusLabel =
          call.status === "missed"
            ? "Missed"
            : call.status === "completed"
            ? "Completed"
            : "Ongoing";
        return {
          callId: call.callId,
          title: formatSenderLabel(otherParticipant),
          statusLabel,
          dateLabel: formatDateLabel(call.startedAt) ?? "—",
          timeLabel: formatTimestamp(call.startedAt) ?? "—",
          type: call.type,
        };
      })
      .slice(0, 6);
  }, [callHistory, auth.userId, formatSenderLabel]);

  const settingsProfile = useMemo(
    () => ({
      name: "Potharaju Tharun",
      status: "──── 🎧 ❤️ 🎧 ─────",
      avatarUrl:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60",
    }),
    [],
  );
  const handleLogout = () => {
    setActionInfo("Logging out... (demo)");
  };
  const settingsProps = {
    profile: settingsProfile,
    onLogout: handleLogout,
  };

  const handleUploadFile = useCallback(
    async (file: File, title: string) => {
      setIsUploadingFile(true);
      setUploadStatus(null);
      try {
        const formData = new FormData();
        formData.append("file", file);
        if (title) {
          formData.append("title", title);
        }
        await uploadFile(formData, auth.token);
        setUploadStatus("File uploaded successfully.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to upload file.";
        setUploadStatus(message);
      } finally {
        setIsUploadingFile(false);
      }
    },
    [auth.token],
  );

  const handleDocumentSelected = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      handleUploadFile(file, file.name);
      event.target.value = "";
    },
    [handleUploadFile],
  );

  const closeAttachmentPanel = () => {
    setActiveAttachmentPanel(null);
  };

  const handleCameraCaptureClick = () => {
    cameraInputRef.current?.click();
  };

  const handleCameraSelected = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      setActionInfo("Uploading camera capture…");
      await handleUploadFile(file, file.name);
      setActionInfo("Camera capture added to workspace.");
      event.target.value = "";
      setActiveAttachmentPanel(null);
    },
    [handleUploadFile],
  );

  const handleAddSticker = () => {
    const trimmed = newStickerLabel.trim();
    if (!trimmed) {
      return;
    }
    setStickerLibrary((prev) => [...prev, trimmed]);
    setNewStickerLabel("");
    setActionInfo(`${trimmed} sticker ready to send.`);
  };

  const handlePollOptionChange = (index: number, value: string) => {
    setPollOptions((prev) =>
      prev.map((option, optionIndex) => (optionIndex === index ? value : option)),
    );
  };

  const handleAddPollOption = () => {
    setPollOptions((prev) =>
      prev.length >= 6 ? prev : [...prev, ""],
    );
  };

  const handlePollSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = pollQuestion.trim();
    const options = pollOptions.map((option) => option.trim()).filter(Boolean);
    if (!question || options.length < 2) {
      setActionInfo("Enter a question and at least two options.");
      return;
    }
    setActionInfo("Poll created. Share it to start collecting votes.");
    setPollQuestion("");
    setPollOptions(["", ""]);
    setActiveAttachmentPanel(null);
  };

  const handleEventSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = eventTitle.trim();
    if (!title) {
      setActionInfo("Give the event a title.");
      return;
    }
    const callTypeLabel = eventCallType === "video" ? "Video" : "Voice";
    setActionInfo(`Scheduled ${callTypeLabel.toLowerCase()} call "${title}".`);
    setEventTitle("");
    setEventDescription("");
    const freshStart = new Date();
    const freshEnd = new Date(freshStart);
    freshEnd.setMinutes(freshEnd.getMinutes() + 30);
    setEventStartDate(freshStart.toISOString().slice(0, 10));
    setEventStartTime(freshStart.toTimeString().slice(0, 5));
    setEventEndDate(freshEnd.toISOString().slice(0, 10));
    setEventEndTime(freshEnd.toTimeString().slice(0, 5));
    setEventHasEndTime(true);
    setEventCallType("video");
    setActiveAttachmentPanel(null);
  };

  const handleFeedbackSubmit = () => {
    const trimmed = feedbackText.trim();
    if (!trimmed) {
      setFeedbackStatus("Let us know what’s on your mind.");
      return;
    }
    setFeedbackStatus("Feedback sent. Thank you!");
    setFeedbackText("");
  };

  const handleStartCall = useCallback(
    async (type: "voice" | "video", participants: number[]) => {
      if (!participants.length) {
        setCallStatus("Select at least one participant.");
        return;
      }
      setIsStartingCall(true);
      setCallStatus("Starting call…");
      try {
        await startCall(
          { type, participantIds: participants },
          auth.token,
        );
        setCallStatus("Call started.");
        setCallDialogMode(null);
        await refreshCallHistory();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to start call.";
        setCallStatus(message);
      } finally {
        setIsStartingCall(false);
      }
    },
    [auth.token, refreshCallHistory],
  );

  const handleCreateTask = useCallback(
    async (payload: { title: string; description: string; dueDate?: string; assigneeId?: number }) => {
      setIsTaskProcessing(true);
      setTaskStatus(null);
      try {
        await createTask(payload, auth.token);
        setTaskStatus("Task created");
        await refreshTasks();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to create task.";
        setTaskStatus(message);
      } finally {
        setIsTaskProcessing(false);
      }
    },
    [auth.token, refreshTasks],
  );

  const handleAssignTask = useCallback(
    async (taskId: string, assigneeId: number) => {
      setIsAssigningTask(true);
      setAssignStatus(null);
      try {
        await assignTask({ taskId, assigneeId }, auth.token);
        setAssignStatus("Assignee updated");
        await refreshTasks();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to assign task.";
        setAssignStatus(message);
      } finally {
        setIsAssigningTask(false);
      }
    },
    [auth.token, refreshTasks],
  );

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAttachmentMenuOpen(false);
    const trimmed = messageText.trim();
    if (!trimmed || !selectedConversationId) {
      return;
    }
    setSendingMessage(true);
    setActionInfo(null);
    try {
      await sendMessage(
        {
          conversationId: selectedConversationId,
          senderId: auth.userId,
          tenantId: auth.tenantId,
          messageText: trimmed,
          messageType: "text",
        },
        auth.token,
      );
      setMessageText("");
      setActionInfo("Message sent");
      await loadMessages();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message.";
      setMessageError(message);
    } finally {
      setSendingMessage(false);
    }
  };

  const buildMemberIds = (others: number[]) =>
    Array.from(new Set([auth.userId, ...others]));

  const createConversationForMembers = useCallback(
    async (members: number[], isGroup: boolean) => {
      if (!members.length) {
        return;
      }
      setIsCreatingConversation(true);
      setConversationError(null);
      try {
        await createConversation(
          {
            tenantId: auth.tenantId,
            memberIds: buildMemberIds(members),
            isGroup,
            name: isGroup ? "Group chat" : "",
          },
          auth.token,
        );
        setActionInfo("Conversation created");
        await refreshConversations();
        setSearchInput("");
        setSelectedUserIds([]);
        setViewMode("chat");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to create conversation.";
        setConversationError(message);
      } finally {
        setIsCreatingConversation(false);
      }
    },
    [auth, refreshConversations],
  );

  const handleDirectConversation = (userId: number) => {
    createConversationForMembers([userId], false);
  };

  const handleCreateGroupConversation = () => {
    if (selectedUserIds.length < 2) {
      return;
    }
    createConversationForMembers(selectedUserIds, true);
  };

  const handleBuilderStartConversation = () => {
    if (!selectedUserIds.length) {
      return;
    }
    if (selectedUserIds.length === 1) {
      handleDirectConversation(selectedUserIds[0]);
      return;
    }
    handleCreateGroupConversation();
  };

  const handleMarkAsRead = async () => {
    if (!messages.length) {
      return;
    }
    const latestMessageId = messages[messages.length - 1].messageId;
    if (!latestMessageId) {
      return;
    }
    setMarkingRead(true);
    setActionInfo(null);
    try {
      await markMessageRead(
        {
          messageId: latestMessageId,
          userId: auth.userId,
        },
        auth.token,
      );
      setActionInfo("Marked latest message as read");
      await refreshConversations();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to mark message as read.";
      setMessageError(message);
    } finally {
      setMarkingRead(false);
    }
  };

  const workspaceTaskStatus = taskStatus ?? assignStatus;
  const showSidebar =
    activeSection !== "feedback" && activeSection !== "media";
  const isArchivedView = activeSection === "archived";
  const sectionLabel = isArchivedView ? "Archived" : undefined;
  const notesViewProps = {
    notes,
    users: tenantUsers,
    isLoading: isNotesLoading,
    isSaving: isNotesSaving,
    error: notesError,
    onSaveNote: handleSaveNote,
    onBack: handleCloseNotes,
    onDeleteNote: handleDeleteNote,
  };

  const conversationBuilderProps = {
    searchInput,
    setSearchInput,
    filteredUsers: filteredTenantUsers,
    selectedUserIds,
    toggleUserSelection,
    onStartConversation: handleBuilderStartConversation,
    isCreating: isCreatingConversation,
    isLoadingUsers,
    usersError,
    onClose: handleCloseConversationPage,
  };

  const feedbackProps = {
    feedback: feedbackText,
    status: feedbackStatus,
    onChange: setFeedbackText,
    onSubmit: handleFeedbackSubmit,
  };

  const chatWorkspaceProps = {
    selectedConversation,
    messages,
    loadingMessages: isLoadingMessages,
    messageError,
    userId: auth.userId,
    selectedConversationId,
    paneRef: messagePaneRef,
    users: tenantUsers,
    formatSenderLabel,
    messageText,
    onMessageChange: setMessageText,
    onSendMessage: handleSendMessage,
    onMarkAsRead: handleMarkAsRead,
    isSending: sendingMessage,
    isMarkingRead: markingRead,
    actionInfo,
    hasMessages: messages.length > 0,
    attachmentActions: attachmentMenuActions,
    isAttachmentMenuOpen,
    onAttachmentToggle: () =>
      setIsAttachmentMenuOpen((prev) => !prev),
    onAttachmentAction: handleAttachmentAction,
    isConversationMenuOpen,
    setConversationMenuOpen: setIsConversationMenuOpen,
    conversationMenuItems,
    handleConversationMenuAction,
    handleOpenCallDialog,
    sectionLabel,
  };

  const callViewProps = {
    recentCalls: callHistoryEntries,
    onStartCall: handleOpenCallDialog,
    onCreateCallLink: () => setActionInfo("Creating a call link soon."),
    onCallNumber: () => setActionInfo("Calling a number soon."),
    onScheduleCall: () => setActiveAttachmentPanel("event"),
  };

  const sidebarMode: SidebarMode =
    activeSection === "calls"
      ? "calls"
      : activeSection === "archived"
      ? "archived"
      : activeSection === "notes"
      ? "notes"
      : "chats";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f0ea] text-zinc-900">
      <SideNav activeSection={activeSection} onSelect={handleSectionChange} />
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
        <ConversationSidebar
          mode={sidebarMode}
          conversations={filteredConversations}
          selectedConversationId={selectedConversationId}
          onSelect={setSelectedConversationId}
          isLoading={isLoadingConversations}
          error={conversationError}
          onOpenNewChat={handleOpenConversationPage}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          callHistory={callHistoryEntries}
          onStartCall={() => handleOpenCallDialog("voice")}
          notes={notes}
          onOpenNotes={handleOpenNotes}
          onDeleteNote={handleDeleteNote}
          onEditNote={handleEditNote}
          onSaveNote={handleSaveNote}
          isNotesSaving={isNotesSaving}
        />
        )}
        <ActiveSectionContent
          activeSection={activeSection}
          viewMode={viewMode}
          notesViewProps={notesViewProps}
          conversationBuilderProps={conversationBuilderProps}
          feedbackProps={feedbackProps}
          chatWorkspaceProps={chatWorkspaceProps}
          callViewProps={callViewProps}
          settingsProps={settingsProps}
        />
        <WorkspaceOverlay
          open={isWorkspaceOverlayOpen}
          focus={workspaceOverlayFocus}
          onClose={handleCloseWorkspaceOverlay}
          history={callHistory}
          tasks={tasks}
          availableUsers={tenantUsers}
          onCreateTask={handleCreateTask}
          onAssignTask={handleAssignTask}
          isProcessing={isTaskProcessing || isAssigningTask}
          taskStatusMessage={workspaceTaskStatus}
          onUpload={handleUploadFile}
          isUploading={isUploadingFile}
          uploadStatusMessage={uploadStatus}
        />
        <CallOverlay
          open={Boolean(callDialogMode)}
          mode={callDialogMode}
          availableUsers={tenantUsers}
          onStartCall={handleStartCall}
          isStartingCall={isStartingCall}
          statusMessage={callStatus}
          onClose={handleCloseCallDialog}
        />
        <ContactsPanel
          open={activeAttachmentPanel === "contacts"}
          tenantUsers={tenantUsers}
          onClose={closeAttachmentPanel}
          onSelect={(userId) => {
            handleDirectConversation(userId);
            closeAttachmentPanel();
          }}
          formatUserName={formatUserName}
        />
        <MessageSearchPanel
          open={isMessageSearchOpen}
          selectedConversationId={selectedConversation?.conversationId ?? null}
          messageSearchQuery={messageSearchQuery}
          setMessageSearchQuery={setMessageSearchQuery}
          searchSenderId={searchSenderId}
          setSearchSenderId={setSearchSenderId}
          messageSenderOptions={messageSenderOptions}
          messageSearchResults={messageSearchResults}
          formatSenderLabel={formatSenderLabel}
          closeSearch={closeMessageSearch}
        />
        <StickersPanel
          open={activeAttachmentPanel === "stickers"}
          stickerLibrary={stickerLibrary}
          newStickerLabel={newStickerLabel}
          onNewStickerChange={setNewStickerLabel}
          onAddSticker={handleAddSticker}
          onClose={closeAttachmentPanel}
        />
        <PollPanel
          open={activeAttachmentPanel === "poll"}
          pollQuestion={pollQuestion}
          pollOptions={pollOptions}
          onPollQuestionChange={setPollQuestion}
          onPollOptionChange={handlePollOptionChange}
          onAddPollOption={handleAddPollOption}
          onSubmit={handlePollSubmit}
          onClose={closeAttachmentPanel}
        />
        <ScheduleCallPanel
          open={activeAttachmentPanel === "event"}
          eventTitle={eventTitle}
          eventDescription={eventDescription}
          eventStartDate={eventStartDate}
          eventStartTime={eventStartTime}
          eventEndDate={eventEndDate}
          eventEndTime={eventEndTime}
          eventHasEndTime={eventHasEndTime}
          eventCallType={eventCallType}
          setEventTitle={setEventTitle}
          setEventDescription={setEventDescription}
          setEventStartDate={setEventStartDate}
          setEventStartTime={setEventStartTime}
          setEventEndDate={setEventEndDate}
          setEventEndTime={setEventEndTime}
          setEventHasEndTime={setEventHasEndTime}
          setEventCallType={setEventCallType}
          onSubmit={handleEventSubmit}
          onClose={closeAttachmentPanel}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleDocumentSelected}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleCameraSelected}
        />
      </div>
    </div>
  );
}
