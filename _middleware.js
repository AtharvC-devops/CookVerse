// Middleware to bypass Vercel authentication completely
export default function middleware(request) {
  // Get the pathname from the URL
  const url = new URL(request.url);
  
  // If it's a Vercel system path, authentication page, or login page, redirect to home
  if (url.pathname.startsWith('/_vercel') || 
      url.pathname === '/login' || 
      url.pathname.includes('/auth') || 
      url.pathname.includes('/authentication')) {
    return Response.redirect(new URL('/', request.url), 301);
  }
  
  // Add headers to disable authentication
  const response = Response.next();
  response.headers.set('X-Middleware-Skip-Auth', 'true');
  response.headers.set('X-Vercel-Skip-Auth', 'true');
  response.headers.set('X-Auth-Return-Redirect', '/');
  response.headers.set('X-Auth-Skip', 'true');
  
  return response;
}

// Configure which paths this middleware will run on - match ALL paths
export const config = {
  matcher: ['/(.*)', '/_vercel(.*)', '/auth(.*)', '/login(.*)'],
};