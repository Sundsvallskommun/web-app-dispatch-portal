import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/admin') {
    return NextResponse.redirect('/admin/');
  }
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
