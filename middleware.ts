import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

const protectedRoutes: { [key: string]: string[] } = {
    '/admin': ['ADMIN'],
    '/owner': ['OWNER'],
    '/main': ['USER', 'OWNER', 'ADMIN'],
    '/restaurant': ['OWNER'],
}

async function getUserFromToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload
    } catch {
        return null
    }
}

export async function middleware(req: NextRequest) {
    console.log("TEST")
    const { pathname } = req.nextUrl
    const token = req.cookies.get('token')?.value

    if (!token) {
        const loginUrl = new URL('/auth/login', req.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    const user = await getUserFromToken(token)
    const userRole = (user?.authorities as string) || ''

    for (const route in protectedRoutes) {
        if (pathname.startsWith(route)) {
            const allowedRoles = protectedRoutes[route]
            if (!allowedRoles.includes(userRole)) {
                return NextResponse.redirect(new URL('/unauthorized', req.url))
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/owner/:path*', '/restaurant/:path*', '/main/:path*'],
}
