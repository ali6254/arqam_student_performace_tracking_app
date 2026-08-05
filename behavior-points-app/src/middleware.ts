import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PROTECTED_PREFIXES: { prefix: string; role: string }[] = [
  { prefix: '/admin', role: 'admin' },
  { prefix: '/staff', role: 'staff' },
  { prefix: '/student', role: 'student' },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const match = PROTECTED_PREFIXES.find(
    (p) => pathname.startsWith(p.prefix) && !pathname.startsWith(`${p.prefix}/login`)
  );
  if (!match) return NextResponse.next();

  const secret = process.env.SESSION_SECRET;
  const token = request.cookies.get('session')?.value;

  if (!secret || !token) {
    return NextResponse.redirect(new URL(`${match.prefix}/login`, request.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (payload.role !== match.role) {
      return NextResponse.redirect(new URL(`${match.prefix}/login`, request.url));
    }
  } catch {
    return NextResponse.redirect(new URL(`${match.prefix}/login`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/staff/:path*', '/student/:path*'],
};
