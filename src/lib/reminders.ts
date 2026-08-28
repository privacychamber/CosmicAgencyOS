import { prisma } from "./prisma";

/**
 * Mock Reminder Execution Service
 * In a real environment, this function would be triggered by a Cron Job (e.g. Vercel Cron)
 * every minute to scan for pending reminders.
 */
export async function processPendingReminders() {
  const now = new Date();

  // Find all pending reminders whose trigger time has passed
  const pendingReminders = await prisma.emailReminder.findMany({
    where: {
      status: "Pending",
      triggerTime: {
        lte: now
      }
    },
    include: {
      meeting: {
        include: {
          organizer: true,
          participants: true
        }
      }
    }
  });

  if (pendingReminders.length === 0) {
    return { processed: 0 };
  }

  // Process each reminder (Mocking Email sending)
  for (const reminder of pendingReminders) {
    console.log(`[Email Service Mock] Sending ${reminder.type} reminder for meeting: ${reminder.meeting.title}`);
    
    // Example: sendEmailTo(reminder.meeting.participants, "Meeting Reminder", ...);
    
    // Mark as Sent
    await prisma.emailReminder.update({
      where: { id: reminder.id },
      data: { status: "Sent" }
    });
  }

  return { processed: pendingReminders.length };
}
