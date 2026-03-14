"use client";

import { CallPanel } from "@/app/components/workspace/CallPanel";
import { FloatingPanel } from "@/app/components/ui/FloatingPanel";
import type { TenantUser } from "@/app/services/userService";

type Props = {
  open: boolean;
  mode: "voice" | "video" | null;
  availableUsers: TenantUser[];
  onStartCall: (type: "voice" | "video", participants: number[]) => Promise<void>;
  isStartingCall: boolean;
  statusMessage: string | null;
  onClose: () => void;
};

export function CallOverlay({
  open,
  mode,
  availableUsers,
  onStartCall,
  isStartingCall,
  statusMessage,
  onClose,
}: Props) {
  if (!open || !mode) {
    return null;
  }

  const title = mode === "voice" ? "Voice call" : "Video call";

  return (
    <FloatingPanel
      open={open}
      title={title}
      subtitle="Call controls"
      categoryLabel="Call"
      widthClassName="max-w-lg"
      onClose={onClose}
    >
      <CallPanel
        availableUsers={availableUsers}
        onStartCall={onStartCall}
        isStartingCall={isStartingCall}
        statusMessage={statusMessage}
      />
    </FloatingPanel>
  );
}
