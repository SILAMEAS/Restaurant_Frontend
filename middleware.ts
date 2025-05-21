import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

// Apply middleware to protected and redirect routes
export const config = {
  matcher: [
    '/', // ✅ this is missing
    '/admin/:path*',
    '/owner/:path*',
    '/restaurant/:path*',
    '/main/:path*',
    '/auth/redirect',
  ],
}
// Define access control for protected routes
const protectedRoutes: { [key: string]: string[] } = {
  '/admin': ['ADMIN'],
  '/owner': ['OWNER'],
  '/restaurant': ['OWNER'],
  '/main': ['ADMIN', 'OWNER', 'USER', 'ENDUSER'],
  '/': ['USER', 'ENDUSER'], // explicitly protect `/` (homepage) from ADMIN/OWNER
}
// Determine where each role should be redirected to
function getRedirectUrlForRole(role: string): string {
  if (role === 'ADMIN') return '/admin'
  if (role === 'OWNER') return '/owner'
  if (role === 'USER' || role === 'ENDUSER') return '/'
  return '/unauthorized'
}


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value
  const user = req.cookies.get('role')?.value;
  if (!token || !user) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  

  // Accept either single string or array
  const roles = [user];
  const userRoles: string[] = Array.isArray(roles) ? roles : [roles];
  const userRole = userRoles[0] || '';

  console.log(userRole,pathname)



  // Handle /auth/redirect for post-login routing
  if (pathname === '/auth/redirect') {
    const redirectPath = getRedirectUrlForRole(userRole)
    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  // Strict protection check: if route is protected and user role is not allowed → redirect to their home
  for (const route in protectedRoutes) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      const allowedRoles = protectedRoutes[route]
      if (!allowedRoles.includes(userRole)) {
        const redirectPath = getRedirectUrlForRole(userRole)
        return NextResponse.redirect(new URL(redirectPath, req.url))
      }
    }
  }

     // Strictly enforce role-based paths
    if (userRole === 'ADMIN' && !pathname.startsWith('/admin')) {
        console.log("A")
        return NextResponse.redirect(new URL('/admin', req.url));
    }
    if (userRole === 'OWNER' && !pathname.startsWith('/owner')) {
         console.log("O")
        return NextResponse.redirect(new URL('/owner', req.url));
    }
    if ((userRole === 'USER' || userRole === 'ENDUSER') && pathname !== '/') {
         console.log("E")
        return NextResponse.redirect(new URL('/', req.url));
    }

  return NextResponse.next()
}

