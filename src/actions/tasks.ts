"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function getTasksByProject(projectId: string) {
  const user = await requirePermission("task.view");
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId, parentTaskId: null },
      include: {
        assignee: true,
        subtasks: true,
        comments: { include: { user: true } },
        attachments: true,
        activities: { include: { user: true } }
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, tasks };
  } catch (error) {
    return { success: false, error: "Failed to fetch tasks" };
  }
}

export async function createTask(data: {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  creatorId: string;
  status: string;
  priority?: string;
  dueDate?: Date;
  parentTaskId?: string;
}) {
  const user = await requirePermission("task.create");
  try {
    const task = await prisma.task.create({
      data,
    });
    await updateProjectProgress(data.projectId);
    revalidatePath(`/projects/${data.projectId}`);
    return { success: true, task };
  } catch (error) {
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTaskStatus(taskId: string, newStatus: string, projectId: string) {
  const user = await requirePermission("task.update");
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    });
    await updateProjectProgress(projectId);
    revalidatePath(`/projects/${projectId}`);
    return { success: true, task };
  } catch (error) {
    return { success: false, error: "Failed to update task status" };
  }
}

async function updateProjectProgress(projectId: string) {
  const allTasks = await prisma.task.findMany({
    where: { projectId, parentTaskId: null },
  });
  
  if (allTasks.length === 0) return;
  
  const completedTasks = allTasks.filter(t => t.status === "Done").length;
  const progress = Math.round((completedTasks / allTasks.length) * 100);
  
  let health = "Healthy";
  const overdueTasks = allTasks.filter(t => t.status !== "Done" && t.dueDate && t.dueDate < new Date());
  if (overdueTasks.length > 3) health = "Critical";
  else if (overdueTasks.length > 0) health = "At Risk";

  await prisma.project.update({
    where: { id: projectId },
    data: { progress, health },
  });
}
