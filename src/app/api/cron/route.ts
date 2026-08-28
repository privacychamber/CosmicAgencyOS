export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { triggerAutomations, executeRun } from "@/lib/automation";

// This endpoint should ideally be protected by a secret token in production
export async function GET(req: Request) {
  try {
    const now = new Date();
    
    // 1. Retry failed automations (max 3 retries)
    const failedRuns = await prisma.automationRun.findMany({
      where: {
        status: "FAILED",
        retryCount: { lt: 3 }
      }
    });

    for (const run of failedRuns) {
      console.log(`[CRON] Retrying AutomationRun ${run.id} (Attempt ${run.retryCount + 1})`);
      await executeRun(run.id);
    }

    // 2. Scheduled Trigger: Project deadline approaching (e.g., within 3 days)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    const upcomingProjects = await prisma.project.findMany({
      where: {
        deadline: {
          gte: now,
          lte: threeDaysFromNow
        },
        status: { notIn: ["Completed", "Cancelled"] }
      }
    });

    for (const project of upcomingProjects) {
      await triggerAutomations("project.deadline_approaching", project.id, {
        daysRemaining: Math.ceil((new Date(project.deadline!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      });
    }

    // 3. Scheduled Trigger: Payment overdue
    const overduePayments = await prisma.payment.findMany({
      where: {
        status: "Pending",
        dueDate: { lt: now }
      }
    });

    for (const payment of overduePayments) {
      await triggerAutomations("payment.overdue", payment.id, {
        amount: payment.amount,
        currency: payment.currency
      });
    }
    
    // 4. Scheduled Trigger: Meeting approaching (e.g. within 1 hour)
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const upcomingMeetings = await prisma.meeting.findMany({
      where: {
        status: "Upcoming",
        startTime: {
          gte: now,
          lte: oneHourFromNow
        }
      }
    });

    for (const meeting of upcomingMeetings) {
      await triggerAutomations("meeting.approaching", meeting.id, {
        title: meeting.title
      });
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${failedRuns.length} retries, ${upcomingProjects.length} upcoming projects, ${overduePayments.length} overdue payments, and ${upcomingMeetings.length} upcoming meetings.`
    });

  } catch (error: any) {
    console.error("[CRON] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
