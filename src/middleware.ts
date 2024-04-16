import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from "jwt-decode";

interface decodedToken {
  exp: number;
}

export default function middleware (request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  // const decoded = token ? jwtDecode(token) as decodedToken : undefined;
  // return NextResponse.next();

  // const decoded = undefined;

  const signInUrl = new URL('/login', request.nextUrl);

  if (!token || typeof token !== 'string'
    //  || !decoded || decoded?.exp * 1000 < Date.now()
  ) {
    if (allowedUrls.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(signInUrl);
  }
}

const allowedUrls = [
  '/login',
  '/cadastro',
  '/esqueci-senha',
];


export const config = {
  matcher: ['/', '/dashboard/:path*'],
}