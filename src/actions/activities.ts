"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function logActivity(data: {
  type: string;
  content: string;
  leadId?: string;
  opportunityId?: string;
}) {
  const user = await requirePermission("lead.update"); // Generalized permission check

  const activity = await prisma.activity.create({
    data: {
      type: data.type,
      content: data.content,
      userId: user.id,
      leadId: data.leadId,
      opportunityId: data.opportunityId
    }
  });

  if (data.leadId) {
    // Optionally update last contacted on the lead
    await prisma.lead.update({
      where: { id: data.leadId },
      data: { lastContacted: new Date() }
    });
    revalidatePath(`/leads/${data.leadId}`);
  }

  return { success: true, activity };
}
