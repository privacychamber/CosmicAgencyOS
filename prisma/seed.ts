import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const roles = [
    { name: 'Super Admin', description: 'Full system access' },
    { name: 'Admin', description: 'System administration' },
    { name: 'BDA Manager', description: 'Business Development Manager' },
    { name: 'BDA', description: 'Business Development Associate' },
    { name: 'Project Manager', description: 'Project Management' },
    { name: 'Team Member', description: 'General team member' },
    { name: 'Finance', description: 'Financial access' },
    { name: 'Viewer', description: 'Read-only access' }
  ]

  const permissions = [
    // Leads
    'lead.view', 'lead.create', 'lead.update', 'lead.delete', 'lead.assign',
    // Clients
    'client.view', 'client.create', 'client.update', 'client.delete',
    // Projects
    'project.view', 'project.create', 'project.update', 'project.delete', 'project.assign', 'project.takeover', 'project.status.update', 'project.member.manage', 'project.financial.view',
    // Tasks
    'task.view', 'task.create', 'task.update', 'task.delete',
    // Payments
    'payment.view', 'payment.create', 'payment.update', 'payment.delete',
    // Users & Settings
    'user.view', 'user.create', 'user.update', 'user.disable',
    'settings.manage'
  ]

  // Create permissions
  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { action: perm },
      update: {},
      create: { action: perm, description: `Permission for ${perm}` }
    })
  }

  // Create roles
  for (const role of roles) {
    const createdRole = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: { name: role.name, description: role.description }
    })
    
    // Assign permissions to roles (Simplified for seed: Super Admin gets all, Viewer gets views, etc.)
    const allPerms = await prisma.permission.findMany()
    let assignedPerms = []
    
    if (role.name === 'Super Admin') {
      assignedPerms = allPerms
    } else if (role.name === 'Viewer') {
      assignedPerms = allPerms.filter(p => p.action.includes('.view'))
    } else if (role.name === 'Finance') {
      assignedPerms = allPerms.filter(p => p.action.includes('payment.') || p.action === 'project.financial.view' || p.action.includes('.view'))
    } else {
      // Basic defaults for others
      assignedPerms = allPerms.filter(p => !p.action.includes('payment.') && !p.action.includes('settings.') && p.action !== 'project.financial.view')
    }

    await prisma.role.update({
      where: { id: createdRole.id },
      data: {
        permissions: {
          connect: assignedPerms.map(p => ({ id: p.id }))
        }
      }
    })

    // Create a test user for this role
    const email = `${role.name.toLowerCase().replace(/ /g, '_')}@test.com`
    await prisma.user.upsert({
      where: { email },
      update: { roleId: createdRole.id, password }, // Update password just in case
      create: {
        email,
        name: `Test ${role.name}`,
        password,
        roleId: createdRole.id
      }
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
