"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function createLead(data: any) {
  const user = await requirePermission("lead.create");

  // Check for unique LinkedIn URL
  if (data.linkedinUrl) {
    const existingLead = await prisma.lead.findUnique({
      where: { linkedinUrl: data.linkedinUrl }
    });

    if (existingLead) {
      return { 
        success: false, 
        error: "Lead already exists", 
        existingLeadId: existingLead.id 
      };
    }
  }

  const lead = await prisma.lead.create({
    data: {
      ...data,
      // Audit log creation in the same transaction
      activities: {
        create: {
          type: "Note",
          content: "Lead created",
          userId: user.id
        }
      }
    }
  });

  revalidatePath("/leads");
  return { success: true, lead };
}

export async function updateLead(id: string, data: any) {
  const user = await requirePermission("lead.update");

  const lead = await prisma.lead.update({
    where: { id },
    data
  });

  // Example Audit Event
  await prisma.activity.create({
    data: {
      type: "StatusChange",
      content: `Lead updated by ${user.name}`,
      userId: user.id,
      leadId: lead.id
    }
  });

  revalidatePath(`/leads`);
  revalidatePath(`/leads/${id}`);
  return { success: true, lead };
}

export async function softDeleteLead(id: string) {
  const user = await requirePermission("lead.delete");

  const lead = await prisma.lead.update({
    where: { id },
    data: { deletedAt: new Date() }
  });

  await prisma.activity.create({
    data: {
      type: "Note",
      content: `Lead moved to Trash by ${user.name}`,
      userId: user.id,
      leadId: lead.id
    }
  });

  revalidatePath("/leads");
  return { success: true };
}
