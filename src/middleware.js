import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  const pathname = request.nextUrl.pathname;
  
  // Log untuk debugging
  console.log('🚀 MIDDLEWARE RUNNING FOR:', pathname);
  console.log('🍪 Token cookie:', token ? 'EXISTS' : 'NOT_FOUND');
  
  // Jika tidak ada token
  if (!token) {
    console.log('🔒 NO TOKEN - REDIRECTING TO HOME');
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Jika ada token, lanjutkan dengan header debug
  console.log('✅ TOKEN FOUND - ACCESS GRANTED');
  const response = NextResponse.next();
  response.headers.set('X-Middleware-Debug', `Accessed ${pathname} with token`);
  return response;
}

export const config = {
  matcher: ['/data'],
};