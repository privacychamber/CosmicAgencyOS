"use server";

import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/rbac";
import { format } from "date-fns";

import { auth } from "@/auth";

// Retrieve the current user context
async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

/**
 * Main entry point for the COSMIC Intelligence chat.
 * Parses the query, enforces RBAC, and routes to specific insight functions.
 */
export async function askCosmic(query: string) {
  const q = query.toLowerCase();
  
  try {
    // 1. Finance & Payments intent
    if (q.includes("payment") || q.includes("money") || q.includes("worth") || q.includes("budget") || q.includes("outstanding")) {
      const canViewFinance = await hasPermission("project.financial.view");
      if (!canViewFinance) {
        return "I'm sorry, but you do not have the required financial permissions to view this information.";
      }
      return await getFinanceInsights();
    }
    
    // 2. Project Risk & Health
    if (q.includes("risk") || q.includes("health") || q.includes("attention")) {
      const canViewProjects = await hasPermission("project.view");
      if (!canViewProjects) return "You do not have permission to view projects.";
      return await getProjectRiskInsights();
    }

    // 3. Lead Intelligence & Follow-ups
    if (q.includes("lead") || q.includes("follow") || q.includes("opportunities") || q.includes("score")) {
      const canViewLeads = await hasPermission("lead.view");
      if (!canViewLeads) return "You do not have permission to view leads.";
      return await getLeadInsights();
    }

    // 4. Daily Brief / Focus
    if (q.includes("today") || q.includes("focus") || q.includes("brief") || q.includes("meeting")) {
      return await getDailyBrief();
    }

    // 5. Agency Performance / Changes (Catch-all)
    if (q.includes("agency") || q.includes("performance") || q.includes("changed") || q.includes("week")) {
      return await getAgencyPerformance();
    }

    // Fallback
    return "I am COSMIC Intelligence. I can help you with Daily Briefs, Lead Intelligence, Project Risks, and Financial Insights. What would you like to know?";
    
  } catch (error: any) {
    console.error("COSMIC AI Error:", error);
    return "I encountered an error while analyzing the agency data. Please try again.";
  }
}

async function getFinanceInsights() {
  const projects = await prisma.project.findMany({
    where: { status: { notIn: ["Completed", "Cancelled"] } }
  });
  
  let totalPending = 0;
  let totalBudget = 0;
  projects.forEach(p => {
    totalPending += p.pending || 0;
    totalBudget += p.finalBudget || 0;
  });

  return `### Financial Insights\n\nCurrently, there is **$${totalPending.toLocaleString()}** in outstanding payments across active projects. The total active pipeline budget is **$${totalBudget.toLocaleString()}**.\n\n_Note: This includes all work-in-progress and on-hold projects._`;
}

async function getProjectRiskInsights() {
  const atRiskProjects = await prisma.project.findMany({
    where: { 
      OR: [
        { status: "Issue" },
        { status: "On Hold" },
        { health: "At Risk" },
        { health: "Off Track" }
      ]
    },
    include: { client: { include: { company: true } } }
  });

  if (atRiskProjects.length === 0) {
    return "Great news! Currently, there are no projects flagged as At Risk or Off Track.";
  }

  let response = `### Project Risk Detection\n\nI found **${atRiskProjects.length}** project(s) that require your attention:\n\n`;
  atRiskProjects.forEach(p => {
    response += `- **${p.name}** (${p.client.company.name}): Status is *${p.status}*.`;
    if (p.issueDescription) response += ` Issue: ${p.issueDescription}`;
    response += "\n";
  });

  return response;
}

async function getLeadInsights() {
  // Simple heuristic for "Hot" or "Untouched" leads
  const leads = await prisma.lead.findMany({
    where: { 
      OR: [
        { status: "New" },
        { priority: "Hot" },
        { nextFollowUp: { lte: new Date() } }
      ]
    },
    take: 5
  });

  if (leads.length === 0) {
    return "All your active leads are currently up to date on their follow-ups.";
  }

  let response = `### Lead Intelligence\n\nHere are the top leads that need immediate follow-up based on their scoring and schedule:\n\n`;
  leads.forEach(l => {
    response += `- **${l.firstName} ${l.lastName}** (${l.companyId ? 'Associated Company' : 'Independent'}): `;
    if (l.priority === "Hot") response += "🔥 High Priority. ";
    if (l.nextFollowUp && new Date(l.nextFollowUp) <= new Date()) response += "⏰ Follow-up is due. ";
    if (l.status === "New") response += "✨ Untouched New Lead. ";
    response += "\n";
  });

  return response;
}

async function getDailyBrief() {
  const user = await getCurrentUser();
  const now = new Date();
  
  // Meetings today
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  const meetings = await prisma.meeting.findMany({
    where: {
      startTime: { gte: now, lte: endOfDay },
      participants: { some: { id: user?.id } }
    }
  });

  // Projects due soon (next 3 days)
  const threeDays = new Date();
  threeDays.setDate(now.getDate() + 3);
  const projectsDue = await prisma.project.findMany({
    where: {
      deadline: { gte: now, lte: threeDays },
      status: { notIn: ["Completed", "Cancelled"] },
      ownerId: user?.id
    }
  });

  let response = `### Daily Brief for ${format(now, "EEEE, MMMM do")}\n\n`;
  
  response += `**Meetings Today:**\n`;
  if (meetings.length > 0) {
    meetings.forEach(m => {
      response += `- ${format(m.startTime, "h:mm a")}: ${m.title}\n`;
    });
  } else {
    response += "No meetings scheduled for today.\n";
  }
  
  response += `\n**Impending Deadlines:**\n`;
  if (projectsDue.length > 0) {
    projectsDue.forEach(p => {
      response += `- **${p.name}** is due on ${p.deadline ? format(p.deadline, "MMM do") : 'N/A'}\n`;
    });
  } else {
    response += "No project deadlines approaching in the next 3 days.\n";
  }

  return response;
}

async function getAgencyPerformance() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const newLeadsCount = await prisma.lead.count({ where: { createdAt: { gte: oneWeekAgo } } });
  const completedProjects = await prisma.project.count({ where: { status: "Completed", updatedAt: { gte: oneWeekAgo } } });
  
  // Conditionally check finance if permitted
  const canViewFinance = await hasPermission("project.financial.view");
  let financeString = "";
  if (canViewFinance) {
    const recentPayments = await prisma.payment.findMany({
      where: { status: "Paid", createdAt: { gte: oneWeekAgo } }
    });
    const totalReceivedWeek = recentPayments.reduce((sum, p) => sum + p.amount, 0);
    financeString = `\n- **Revenue:** Collected **$${totalReceivedWeek.toLocaleString()}** in payments.`;
  }

  return `### Agency Performance (Last 7 Days)\n\n- **Pipeline:** Generated **${newLeadsCount}** new leads.\n- **Delivery:** Successfully completed **${completedProjects}** project(s).${financeString}`;
}
