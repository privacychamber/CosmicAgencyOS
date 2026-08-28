"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function createPayment(data: {
  amount: number;
  status: string;
  projectId: string;
  notes?: string;
  dueDate?: Date;
  paidAt?: Date;
}) {
  const user = await requirePermission("project.financial.manage");

  try {
    const payment = await prisma.payment.create({
      data: {
        ...data,
        addedById: user.id
      }
    });

    await recalculateProjectFinancials(data.projectId);

    await prisma.auditLog.create({
      data: {
        action: "payment.create",
        entityType: "Project",
        entityId: data.projectId,
        userId: user.id,
        changes: JSON.stringify({ amount: data.amount, status: data.status })
      }
    });

    revalidatePath(`/projects/${data.projectId}`);
    revalidatePath(`/finance`);
    return { success: true, payment };
  } catch (error) {
    return { success: false, error: "Failed to create payment" };
  }
}

export async function recalculateProjectFinancials(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { payments: true }
  });

  if (!project) return;

  const totalReceived = project.payments
    .filter(p => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const finalBudget = project.finalBudget || 0;
  const pending = finalBudget - totalReceived;

  await prisma.project.update({
    where: { id: projectId },
    data: {
      received: totalReceived,
      pending: pending >= 0 ? pending : 0,
    }
  });
}

export async function getFinanceDashboardData() {
  const user = await requirePermission("project.financial.view");

  try {
    const projects = await prisma.project.findMany({
      include: {
        client: { include: { company: true } },
        payments: {
          include: { addedBy: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    let totalBudget = 0;
    let totalReceived = 0;
    let totalOutstanding = 0;
    let recentPayments: any[] = [];
    const clientSummaries: Record<string, any> = {};

    projects.forEach(project => {
      totalBudget += project.finalBudget || 0;
      totalReceived += project.received || 0;
      totalOutstanding += project.pending || 0;

      recentPayments.push(...project.payments);

      const clientId = project.client.id;
      if (!clientSummaries[clientId]) {
        clientSummaries[clientId] = {
          clientName: project.client.company.name,
          totalProjects: 0,
          totalBudget: 0,
          totalReceived: 0,
          totalOutstanding: 0
        };
      }
      clientSummaries[clientId].totalProjects += 1;
      clientSummaries[clientId].totalBudget += project.finalBudget || 0;
      clientSummaries[clientId].totalReceived += project.received || 0;
      clientSummaries[clientId].totalOutstanding += project.pending || 0;
    });

    recentPayments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      success: true,
      data: {
        totalBudget,
        totalReceived,
        totalOutstanding,
        recentPayments: recentPayments.slice(0, 10),
        clientSummaries: Object.values(clientSummaries)
      }
    };
  } catch (error) {
    return { success: false, error: "Failed to load finance dashboard" };
  }
}
