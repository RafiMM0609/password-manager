import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  // Clear the token cookie
  response.cookies.set('token', '', {
    path: '/',
    expires: new Date(0), // Set expiry to past date to delete
    httpOnly: false,
    secure: false,
    sameSite: 'lax'
  });
  
  return response;
}
