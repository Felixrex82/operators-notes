/**
 * Called at build/startup to catch dangerous misconfigurations.
 * Import this in any server component or API route that needs it.
 */
export function checkAdminEnv() {
  if (process.env.NODE_ENV !== "production") return;

  const password = process.env.ADMIN_PASSWORD || "";
  const secret = process.env.ADMIN_SECRET || "";

  if (!password || password === "admin" || password.length < 16) {
    throw new Error(
      "[SECURITY] ADMIN_PASSWORD must be set and at least 16 characters in production."
    );
  }

  if (!secret || secret === "dev-secret-change-in-production" || secret.length < 32) {
    throw new Error(
      "[SECURITY] ADMIN_SECRET must be set and at least 32 random characters in production."
    );
  }
}
