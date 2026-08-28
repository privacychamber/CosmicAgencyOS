// src/lib/rbac.ts

export type PermissionAction = 
  | "lead.view"
  | "lead.create"
  | "lead.update"
  | "lead.delete"
  | "lead.assign"
  | "project.view"
  | "project.update"
  | "project.takeover"
  | "project.financial.view"
  | "project.financial.manage";

// Mock session to simulate a logged-in user with specific permissions.
// In Phase 3, this will be replaced with actual NextAuth session parsing.
export const mockSession = {
  user: {
    id: "user_mock_123",
    name: "Admin User",
    role: "Admin",
    permissions: [
      "lead.view",
      "lead.create",
      "lead.update",
      "lead.delete",
      "lead.assign"
    ] as PermissionAction[]
  }
};

/**
 * Validates if the current session has the required permission.
 * Throws an error if not authorized.
 */
export async function requirePermission(action: PermissionAction) {
  const session = mockSession; // TODO: Await actual auth() call here
  
  if (!session?.user?.permissions?.includes(action)) {
    throw new Error(`Unauthorized: Missing permission '${action}'`);
  }
  
  return session.user;
}

/**
 * Returns a boolean instead of throwing, useful for conditional UI rendering.
 */
export function hasPermission(action: PermissionAction) {
  return mockSession.user.permissions.includes(action);
}
