import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Skip middleware for main domain and localhost
  if (hostname === 'adeebrq.me' || hostname === 'localhost:8080' || hostname === 'localhost:3000') {
    return NextResponse.next()
  }
  
  // Handle portfolio.adeebrq.me (main portfolio app)
  if (hostname === 'portfolio.adeebrq.me') {
    return NextResponse.next() // Let it serve normally
  }
  
  // Handle user subdomains: username.portfolio.adeebrq.me
  if (hostname.endsWith('.portfolio.adeebrq.me')) {
    const subdomain = hostname.split('.')[0] // Extract username
    
    // Skip if no subdomain or if it's www/api
    if (!subdomain || subdomain === 'www' || subdomain === 'api') {
      return NextResponse.next()
    }
    
    // Rewrite to portfolio page with username query parameter
    url.pathname = '/portfolio'
    url.searchParams.set('username', subdomain)
    
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
