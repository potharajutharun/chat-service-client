"use client";

import { FileUpload } from "@/app/components/workspace/FileUpload";
import { CallHistory } from "@/app/components/workspace/CallHistory";
import { TaskManager } from "@/app/components/workspace/TaskManager";
import { FloatingPanel } from "@/app/components/ui/FloatingPanel";
import type { CallRecord, Task } from "@/app/services/workspaceService";
import type { TenantUser } from "@/app/services/userService";

export type WorkspaceOverlayFocus = "files" | "tasks" | "history";

const workspaceFocusLabels: Record<WorkspaceOverlayFocus, string> = {
  files: "File uploads",
  tasks: "Task manager",
  history: "Call history",
};

type Props = {
  open: boolean;
  focus: WorkspaceOverlayFocus | null;
  onClose: () => void;
  history: CallRecord[];
  tasks: Task[];
  availableUsers: TenantUser[];
  onCreateTask: (
    payload: { title: string; description: string; dueDate?: string; assigneeId?: number },
    token?: string,
  ) => Promise<void>;
  onAssignTask: (taskId: string, assigneeId: number) => Promise<void>;
  isProcessing: boolean;
  taskStatusMessage: string | null;
  onUpload: (file: File, title: string) => Promise<void>;
  isUploading: boolean;
  uploadStatusMessage: string | null;
};

export function WorkspaceOverlay({
  open,
  focus,
  onClose,
  history,
  tasks,
  availableUsers,
  onCreateTask,
  onAssignTask,
  isProcessing,
  taskStatusMessage,
  onUpload,
  isUploading,
  uploadStatusMessage,
}: Props) {
  if (!open) {
    return null;
  }

  const title = focus ? workspaceFocusLabels[focus] : "Workspace tools";
  const subtitle = focus
    ? `Focus on ${workspaceFocusLabels[focus].toLowerCase()}`
    : "File uploads, calls, and tasks";

  return (
    <FloatingPanel
      open={open}
      title={title}
      subtitle={subtitle}
      categoryLabel="Workspace"
      widthClassName="max-w-5xl"
      onClose={onClose}
    >
      <div className="space-y-6">
        <FileUpload
          onUpload={onUpload}
          isUploading={isUploading}
          statusMessage={uploadStatusMessage}
        />
        <CallHistory history={history} />
        <TaskManager
          tasks={tasks}
          availableUsers={availableUsers}
          onCreateTask={onCreateTask}
          onAssignTask={onAssignTask}
          isProcessing={isProcessing}
          statusMessage={taskStatusMessage}
        />
      </div>
    </FloatingPanel>
  );
}
