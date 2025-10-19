// Middleware to bypass Vercel login page
export default function middleware(request) {
  // Get the pathname from the URL
  const url = new URL(request.url);
  
  // If it's a Vercel system path or login page, redirect to home
  if (url.pathname.startsWith('/_vercel') || url.pathname === '/login') {
    return Response.redirect(new URL('/', request.url));
  }
  
  // Continue with the request for all other paths
  return Response.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: ['/(.*)', '/_vercel(.*)'],
};