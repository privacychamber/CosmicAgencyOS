"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { triggerAutomations } from "@/lib/automation";

export async function updateProjectStatus(id: string, newStatus: string, payload?: {
  issueDescription?: string;
  holdReason?: string;
  expectedResumeDate?: Date;
}) {
  const user = await requirePermission("project.update");

  const oldProject = await prisma.project.findUniqueOrThrow({ where: { id } });

  // Require justification for specific statuses
  if (newStatus === "Issue" && !payload?.issueDescription) {
    throw new Error("Issue description is required.");
  }
  if (newStatus === "On Hold" && !payload?.holdReason) {
    throw new Error("Hold reason is required.");
  }

  const updateData: any = {
    status: newStatus,
    issueDescription: newStatus === "Issue" ? payload?.issueDescription : null,
    holdReason: newStatus === "On Hold" ? payload?.holdReason : null,
    expectedResumeDate: newStatus === "On Hold" ? payload?.expectedResumeDate : null,
    completedAt: newStatus === "Completed" ? new Date() : null,
  };

  const project = await prisma.project.update({
    where: { id },
    data: updateData
  });

  // Create audit activity
  let note = `Project moved from ${oldProject.status} to ${newStatus}.`;
  if (newStatus === "Issue") note += `\nIssue: ${payload?.issueDescription}`;
  if (newStatus === "On Hold") note += `\nHold Reason: ${payload?.holdReason}`;

  await prisma.activity.create({
    data: {
      type: "StatusChange",
      content: note,
      userId: user.id
    }
  });

  // [Phase 7]: Trigger automations
  await triggerAutomations("project.status_changed", id, { newStatus, previousStatus: oldProject.status });
  
  if (newStatus === "Completed") {
    await triggerAutomations("project.completed", id, {});
  }
  // Simulate At Risk if it's an Issue
  if (newStatus === "Issue") {
    await triggerAutomations("project.at_risk", id, { reason: payload?.issueDescription });
  }

  revalidatePath(`/projects`);
  revalidatePath(`/projects/${id}`);
  return { success: true, project };
}

export async function takeOverProject(id: string, reason?: string) {
  const user = await requirePermission("project.takeover");
  const project = await prisma.project.findUniqueOrThrow({ where: { id } });

  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      ownerId: user.id,
      assignedBdaId: user.id
    }
  });

  await prisma.projectOwnershipHistory.create({
    data: {
      projectId: id,
      previousOwnerId: project.ownerId,
      newOwnerId: user.id,
      reason
    }
  });

  await prisma.activity.create({
    data: {
      type: "Note",
      content: `Project taken over by ${user.name}. Reason: ${reason || "N/A"}`,
      userId: user.id
    }
  });

  // [Phase 7]: Trigger automations
  await triggerAutomations("project.assigned", id, { newOwnerId: user.id });

  // [Phase 6 Finance]: Send assignment email without exposing financial data.
  // const { finalBudget, received, pending, ...safeProjectData } = updatedProject;
  // sendEmail(user.email, "You have been assigned a project", safeProjectData);

  revalidatePath(`/projects/${id}`);
  return { success: true, project: updatedProject };
}

export async function getProjectById(id: string) {
  const user = await requirePermission("project.view");
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: { include: { company: true } },
        owner: true,
        assignedBda: true,
        members: { include: { user: true } },
        milestones: { include: { tasks: true } },
        tasks: {
          where: { parentTaskId: null },
          include: {
            assignee: true,
            subtasks: { include: { assignee: true } },
            comments: true,
            attachments: true,
          }
        },
        documents: true,
        payments: { orderBy: { createdAt: "desc" } },
      }
    });
    return { success: true, project };
  } catch (error) {
    return { success: false, error: "Failed to load project details." };
  }
}
