import { NextResponse } from 'next/server';

export function middleware(request) {
  const isLoggedIn = request.cookies.get('token');
  if (!isLoggedIn && request.nextUrl.pathname != '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
    // if (request.nextUrl.pathname.startsWith('/simpanan')) {
    //     return NextResponse.redirect(new URL('/', request.url));
    // }
}

export const config = {
  matcher: ['/dashboard/:path*', '/simpanan/:path*'],
};