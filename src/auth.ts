import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    permissions: string[];
  }
  interface Session {
    user: User & {
      id: string;
      role: string;
      permissions: string[];
    };
  }
}

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { role: { include: { permissions: true } } }
        })
        
        if (!user || !user.password) return null
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string, 
          user.password
        )
        
        if (!isPasswordValid) return null
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role?.name || "Viewer",
          permissions: user.role?.permissions.map(p => p.action) || []
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.permissions = user.permissions
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.permissions = token.permissions as string[]
      }
      return session
    }
  },
  session: { strategy: "jwt" },
  trustHost: true
})
