import { auth } from "@/auth";

export type PermissionAction = string;

/**
 * Validates if the current session has the required permission.
 * Throws an error if not authorized.
 */
export async function requirePermission(action: PermissionAction) {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error("Unauthorized: Not logged in");
  }

  // NextAuth types might need augmenting, we assume permissions is string[]
  const permissions = (session.user as any).permissions as string[];
  
  if (!permissions?.includes(action) && (session.user as any).role !== "Super Admin") {
    // Super Admin overrides or explicit check
    if (!permissions?.includes(action)) {
      throw new Error(`Unauthorized: Missing permission '${action}'`);
    }
  }
  
  return session.user as { id: string; name: string; email: string; role: string; permissions: string[] };
}

/**
 * Requires the user to be authenticated.
 * Throws an error if not.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Not logged in");
  }
  return session.user as { id: string; name: string; email: string; role: string; permissions: string[] };
}

/**
 * Returns a boolean instead of throwing, useful for conditional UI rendering.
 * Should be awaited since it calls auth().
 */
export async function hasPermission(action: PermissionAction) {
  const session = await auth();
  if (!session?.user) return false;
  
  const permissions = (session.user as any).permissions as string[];
  if ((session.user as any).role === "Super Admin") return true;

  return permissions?.includes(action) ?? false;
}
