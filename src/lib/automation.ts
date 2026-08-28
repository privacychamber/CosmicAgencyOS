import { prisma } from "@/lib/prisma";

/**
 * Trigger matching automations based on an event.
 */
export async function triggerAutomations(
  triggerEvent: string,
  entityId: string,
  contextData: any = {}
) {
  // Find all active automations for this event
  const automations = await prisma.automation.findMany({
    where: { triggerEvent, isActive: true }
  });

  for (const automation of automations) {
    // Basic condition evaluation
    let conditionsMet = true;
    if (automation.conditions) {
      const conditions = automation.conditions as Record<string, any>;
      for (const [key, expectedValue] of Object.entries(conditions)) {
        if (contextData[key] !== expectedValue) {
          conditionsMet = false;
          break;
        }
      }
    }

    if (!conditionsMet) continue;

    // Generate an idempotent key to prevent duplicate runs for the same event+entity
    // e.g. "project.status_changed:proj_123:At Risk"
    const contextHash = JSON.stringify(contextData).replace(/[^a-zA-Z0-9]/g, '');
    const idempotentKey = `${automation.id}:${entityId}:${contextHash}`;

    // Create the run record in PENDING state
    try {
      const run = await prisma.automationRun.create({
        data: {
          automationId: automation.id,
          entityId,
          idempotentKey,
          status: "PENDING"
        }
      });

      // Execute asynchronously (fire and forget for now)
      executeRun(run.id).catch(console.error);
    } catch (error: any) {
      // Prisma P2002 means unique constraint failed on idempotentKey, safely ignore
      if (error.code !== "P2002") {
        console.error("Failed to queue automation run", error);
      }
    }
  }
}

/**
 * Execute a specific run, with retry logic and user preference checks.
 */
export async function executeRun(runId: string) {
  const run = await prisma.automationRun.findUnique({
    where: { id: runId },
    include: { automation: true }
  });

  if (!run || run.status === "SUCCESS") return; // Already succeeded or missing

  try {
    const { actionType, actionPayload } = run.automation;
    const payload = actionPayload as any;

    // Check user preferences if the action targets a specific user
    if (payload.targetUserId) {
      const targetUser = await prisma.user.findUnique({
        where: { id: payload.targetUserId }
      });
      
      const prefs = (targetUser?.preferences as Record<string, boolean>) || {};
      
      if (actionType === "send_email" && prefs.emailEnabled === false) {
        throw new Error("User opted out of emails");
      }
      if (actionType === "create_notification" && prefs.inAppEnabled === false) {
        throw new Error("User opted out of in-app notifications");
      }
    }

    // Execute the actual action (Mocked implementations for this demo)
    console.log(`[AUTOMATION EXEC] Running ${actionType} for entity ${run.entityId}`);
    
    if (actionType === "send_email") {
      // Mock sending email
      console.log(`Sending email to user ${payload.targetUserId} about ${run.entityId}`);
    } else if (actionType === "create_notification") {
      // Mock creating a notification
      console.log(`Creating notification for user ${payload.targetUserId} about ${run.entityId}`);
    } else if (actionType === "create_activity") {
      // Create an activity log
      await prisma.activity.create({
        data: {
          type: "Automation",
          content: payload.content || "Automated action executed.",
          userId: payload.actorUserId || "system", 
          projectId: run.entityId // Assuming entityId is project for this action
        }
      } as any); // Type cast due to generic nature
    }

    // Mark as success
    await prisma.automationRun.update({
      where: { id: runId },
      data: { status: "SUCCESS" }
    });

  } catch (error: any) {
    console.error(`[AUTOMATION FAIL] Run ${runId} failed:`, error.message);
    
    // Increment retry count and mark as FAILED
    await prisma.automationRun.update({
      where: { id: runId },
      data: { 
        status: "FAILED", 
        error: error.message,
        retryCount: run.retryCount + 1
      }
    });
  }
}
