import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const userCount = await prisma.user.count()
    const roleCount = await prisma.role.count()
    const permCount = await prisma.permission.count()
    
    console.log(`Users: ${userCount}`)
    console.log(`Roles: ${roleCount}`)
    console.log(`Permissions: ${permCount}`)

    const superAdmin = await prisma.user.findFirst({
      where: { role: { name: 'Super Admin' } },
      include: { role: { include: { permissions: true } } }
    })
    
    console.log(`Super Admin User: ${superAdmin?.email}`)
    console.log(`Super Admin Role: ${superAdmin?.role?.name}`)
    console.log(`Super Admin Perms Count: ${superAdmin?.role?.permissions?.length}`)
  } catch (e) {
    console.error("ERROR:", e.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
