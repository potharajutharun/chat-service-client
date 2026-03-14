export type TenantUser = {
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

import mockUsers from "@/mock-data/users-tenant-13.json";

const USER_API_BASE = "http://localhost:4000";

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
    console.warn(`User service fallback triggered for ${label}:`, error);
    return fallback;
  }
};

export const fetchTenantUsers = async (
  tenantId: number,
  token?: string,
): Promise<TenantUser[]> => {
  return withFallback(
    async () => {
      const response = await fetch(
        `${USER_API_BASE}/api/v1/auth/tenants/${tenantId}/users`,
        {
          headers: buildHeaders(token),
          cache: "no-store",
        },
      );
      if (!response.ok) {
        const text = (await response.text()) || response.statusText;
        throw new Error(text);
      }
      return (await response.json()) as TenantUser[];
    },
    mockUsers as TenantUser[],
    "fetchTenantUsers",
  );
};
