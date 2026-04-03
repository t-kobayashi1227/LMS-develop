import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/' || pathname === '/admin';

  if (!token && !isLoginPage) {
    const loginUrl = pathname.startsWith('/admin') ? '/admin' : '/';
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  // Prevent students from accessing admin pages and vice versa
  if (token && role) {
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
    if (pathname.startsWith('/student') && role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/admin/:path((?!$).*)'],
};
