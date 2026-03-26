import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/' || pathname === '/admin';

  if (!token && !isLoginPage) {
    const loginUrl = pathname.startsWith('/admin') ? '/admin' : '/';
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/admin/:path((?!$).*)'],
};
