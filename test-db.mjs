import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log("SUCCESS")
  } catch (e) {
    console.error("ERROR:", e.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
