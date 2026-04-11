import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard routes
  if (!pathname.startsWith('/portal/dashboard')) {
    return NextResponse.next();
  }

  // Check for Supabase auth cookies
  // Supabase stores auth in cookies with names starting with 'sb-'
  const authCookies = request.cookies.getAll().filter(
    cookie => cookie.name.startsWith('sb-') && cookie.name.includes('auth-token')
  );

  // If no auth token cookie exists, redirect to login
  if (authCookies.length === 0) {
    const loginUrl = new URL('/portal/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/dashboard/:path*'],
};
