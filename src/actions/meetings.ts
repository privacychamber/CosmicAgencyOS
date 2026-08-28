"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

/**
 * Creates the 3 standard reminders for a meeting
 */
async function scheduleReminders(meetingId: string, startTime: Date) {
  const oneDayBefore = new Date(startTime.getTime() - 24 * 60 * 60 * 1000);
  const oneHourBefore = new Date(startTime.getTime() - 60 * 60 * 1000);
  const tenMinsBefore = new Date(startTime.getTime() - 10 * 60 * 1000);

  const reminders = [
    { type: "1_day", triggerTime: oneDayBefore },
    { type: "1_hour", triggerTime: oneHourBefore },
    { type: "10_min", triggerTime: tenMinsBefore }
  ];

  for (const reminder of reminders) {
    if (reminder.triggerTime > new Date()) {
      await prisma.emailReminder.create({
        data: {
          type: reminder.type,
          triggerTime: reminder.triggerTime,
          meetingId,
          status: "Pending"
        }
      });
    }
  }
}

export async function createMeeting(data: { title: string; startTime: Date; endTime: Date; leadId?: string; opportunityId?: string }) {
  const user = await requirePermission("lead.update"); // Assuming meeting requires update permissions

  const meeting = await prisma.meeting.create({
    data: {
      ...data,
      organizerId: user.id,
      status: "Upcoming"
    }
  });

  await scheduleReminders(meeting.id, data.startTime);

  // Log Activity
  await prisma.activity.create({
    data: {
      type: "Meeting",
      content: `Scheduled meeting: ${data.title}`,
      userId: user.id,
      leadId: data.leadId,
      opportunityId: data.opportunityId
    }
  });

  revalidatePath("/calendar");
  return { success: true, meeting };
}

export async function rescheduleMeeting(id: string, newStartTime: Date, newEndTime: Date) {
  const user = await requirePermission("lead.update");

  const meeting = await prisma.meeting.update({
    where: { id },
    data: {
      startTime: newStartTime,
      endTime: newEndTime,
      status: "Rescheduled"
    }
  });

  // Cancel existing pending reminders
  await prisma.emailReminder.updateMany({
    where: { meetingId: id, status: "Pending" },
    data: { status: "Cancelled" }
  });

  // Schedule new reminders based on new time
  await scheduleReminders(meeting.id, newStartTime);

  await prisma.activity.create({
    data: {
      type: "Meeting",
      content: `Meeting rescheduled to ${newStartTime.toLocaleString()}`,
      userId: user.id,
      leadId: meeting.leadId,
      opportunityId: meeting.opportunityId
    }
  });

  revalidatePath("/calendar");
  return { success: true, meeting };
}
