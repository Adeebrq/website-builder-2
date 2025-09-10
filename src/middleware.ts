import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Check if it's a subdomain (not the main domain)
  const subdomain = hostname.split('.')[0]
  
  // Skip middleware for main domain and localhost
  if (hostname === 'adeebrq.me' || hostname === 'localhost:8080' || hostname === 'localhost') {
    return NextResponse.next()
  }
  
  // If it's a subdomain, rewrite to the username route
  if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
    url.pathname = `/${subdomain}${url.pathname}`
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
