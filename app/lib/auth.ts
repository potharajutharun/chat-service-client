type JwtPayload = Record<string, unknown>;

const getStoredToken = () => {
  if (typeof window === "undefined") {
    return "";
  }
  return (
    window.localStorage.getItem("token") ??
    window.sessionStorage.getItem("token") ??
    ""
  );
};

const decodeJwtPayload = (token: string): JwtPayload | null => {
  if (!token) {
    return null;
  }
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  const payload = parts[1];
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(padLength);
  try {
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export type AuthInfo = {
  userId: number;
  tenantId: number;
  token: string;
};

export const DEFAULT_USER_ID = 1;
export const DEFAULT_TENANT_ID = 1;

export const deriveAuthInfo = (): AuthInfo => {
  const token = getStoredToken();
  const payload = decodeJwtPayload(token);
  const userId =
    Number(
      payload?.["userId"] ??
        payload?.["uid"] ??
        payload?.["sub"] ??
        DEFAULT_USER_ID,
    ) || DEFAULT_USER_ID;
  const tenantId =
    Number(
      payload?.["tenantId"] ??
        payload?.["tid"] ??
        DEFAULT_TENANT_ID,
    ) || DEFAULT_TENANT_ID;
  return { userId, tenantId, token };
};
