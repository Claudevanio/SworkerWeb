import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface decodedToken {
  exp: number;
}

function removeTokenCookie(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.nextUrl));
  response.cookies.set('token', '', { maxAge: 0 });
  return response;
}

export function middleware(request: NextRequest) {
  debugger;
  const token = request.cookies.get('token')?.value;

  if (!token || typeof token !== 'string') {
    if (request.nextUrl.pathname === '/login') return NextResponse.next();

    return removeTokenCookie(request);
  }

  const decoded = token ? (jwtDecode(token) as decodedToken) : undefined;

  if (!decoded) return removeTokenCookie(request);

  if (decoded.exp * 1000 < Date.now()) return removeTokenCookie(request);

  if (request.nextUrl.pathname === '/login' && decoded) return NextResponse.redirect(new URL('/', request.nextUrl));

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/empresa/:companyId*', '/perfil', '/login']
};
