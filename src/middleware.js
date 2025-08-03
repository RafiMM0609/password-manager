import { NextResponse } from 'next/server';

export function middleware(request) {
//   const isLoggedIn = request.cookies.get('token');
//   if (!isLoggedIn && request.nextUrl.pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }
//   return NextResponse.next();
    if (request.nextUrl.pathname.startsWith('/simpanan')) {
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
  matcher: ['/dashboard/:path*', '/simpanan/:path*'],
};