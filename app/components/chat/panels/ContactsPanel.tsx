"use client";

import { FloatingPanel } from "@/app/components/ui/FloatingPanel";
import type { TenantUser } from "@/app/services/userService";

type Props = {
  open: boolean;
  tenantUsers: TenantUser[];
  onClose: () => void;
  onSelect: (userId: number) => void;
  formatUserName: (user: TenantUser) => string;
};

export function ContactsPanel({
  open,
  tenantUsers,
  onClose,
  onSelect,
  formatUserName,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <FloatingPanel
      open={open}
      title="Contacts"
      subtitle="Tap to open a conversation"
      categoryLabel="Attachment"
      widthClassName="max-w-md"
      onClose={onClose}
    >
      <div className="space-y-4">
        {tenantUsers.length === 0 ? (
          <p className="text-sm text-zinc-400">
            No other workspace contacts are available yet.
          </p>
        ) : (
          <div className="space-y-2">
            {tenantUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-left text-sm text-white transition hover:border-white hover:bg-zinc-900"
                onClick={() => onSelect(user.id)}
              >
                <span>{formatUserName(user)}</span>
                <span className="text-xs text-zinc-500">Open chat</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </FloatingPanel>
  );
}
