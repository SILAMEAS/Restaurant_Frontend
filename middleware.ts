import {NextRequest, NextResponse} from 'next/server'
import {COOKIES} from "@/constant/COOKIES";
import {Role} from "@/lib/redux/counterSlice";
import {Route} from "@/constant/Route";

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
const protectedRoutes: { [key: string]: Role[] } = {
  [Route.ADMIN.HOME]: [Role.ADMIN],
  [Route.OWNER.HOME]: [Role.OWNER],
  [Route.RESTAURANT.HOME]: [Role.OWNER],
  [Route.PUBLIC.MAIN.HOME]: [Role.ADMIN, Role.OWNER, Role.USER],
  [Route.ROOT]: [Role.USER], // explicitly protect `/` (homepage) from ADMIN/OWNER
}
// Determine where each role should be redirected to
function getRedirectUrlForRole(role: Role): string {
  if (role === Role.ADMIN) return Route.ADMIN.HOME
  if (role === Role.OWNER) return Route.OWNER.HOME
  if (role === Role.USER) return Route.END_UER.HOME
  return Route.PUBLIC.UNAUTHORIZED.HOME
}
function getRedirectUrl(userRole: string, pathname: string, baseUrl: string): string | null {
  if (userRole === Role.ADMIN && !pathname.startsWith(Route.ADMIN.HOME)) {
    return new URL(Route.ADMIN.HOME, baseUrl).toString();
  }
  if (userRole === Role.OWNER && !pathname.startsWith(Route.OWNER.HOME)) {
    return new URL(Route.OWNER.HOME, baseUrl).toString();
  }
  if (userRole === Role.USER && pathname !== Route.END_UER.HOME) {
    return new URL(Route.END_UER.HOME, baseUrl).toString();
  }
  return null; // No redirection needed
}


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get(COOKIES.TOKEN)?.value
  const user = req.cookies.get(COOKIES.ROLE)?.value;
  if (!token || !user) {
    const loginUrl = new URL(Route.PUBLIC.AUTH.LOGIN, req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  

  // Accept either single string or array
  const roles = [user];
  const userRoles: string[] = Array.isArray(roles) ? roles : [roles];
  const userRole:Role = (userRoles[0] || '') as Role;




  // Handle /auth/redirect for post-login routing
  if (pathname ===Route.PUBLIC.AUTH.REDIRECT) {
    const redirectPath = getRedirectUrlForRole(userRole)
    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  // Strict protection check: if route is protected and user role is not allowed → redirect to their home
  for (const route in protectedRoutes) {
    if (pathname === route || pathname.startsWith(route + Route.ROOT)) {
      const allowedRoles = protectedRoutes[route]
      if (!allowedRoles.includes(userRole)) {
        const redirectPath = getRedirectUrlForRole(userRole)
        return NextResponse.redirect(new URL(redirectPath, req.url))
      }
    }
  }
  const redirectUrl = getRedirectUrl(userRole, pathname, req.url);

    if (redirectUrl) {
      return NextResponse.redirect(redirectUrl);
    }

  return NextResponse.next()
}

