import { auth } from "@/auth"
import { NextResponse } from "next/server"

// List of protected base paths
const protectedPaths = [
  "/dashboard",
  "/leads",
  "/clients",
  "/projects",
  "/calendar",
  "/activities",
  "/notifications",
  "/finance",
  "/settings",
  "/pipeline"
]

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path)) || pathname === '/'

  if (isProtectedPath && !isLoggedIn) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL("/api/auth/signin", req.url))
  }
  
  return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
