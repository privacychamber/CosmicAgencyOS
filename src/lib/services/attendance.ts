"use server"

import { prisma } from "@/lib/prisma"

export async function clockIn(userId: string, location: "Office" | "Home" = "Office") {
  // Check if user already has an active session
  const activeSession = await prisma.attendanceSession.findFirst({
    where: {
      userId,
      status: "Active"
    }
  });

  if (activeSession) {
    throw new Error("User already has an active work session.");
  }

  const session = await prisma.attendanceSession.create({
    data: {
      userId,
      location,
      status: "Active"
    }
  });

  return session;
}

export async function clockOut(userId: string) {
  // Find the active session
  const activeSession = await prisma.attendanceSession.findFirst({
    where: {
      userId,
      status: "Active"
    }
  });

  if (!activeSession) {
    throw new Error("No active work session found to clock out of.");
  }

  const endTime = new Date();
  const durationMs = endTime.getTime() - activeSession.startTime.getTime();
  const durationMinutes = Math.round(durationMs / 60000);

  const session = await prisma.attendanceSession.update({
    where: { id: activeSession.id },
    data: {
      endTime,
      durationMinutes,
      status: "Completed"
    }
  });

  return session;
}
