// middleware.ts - CLEANUP

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server'; // Import NextResponse for manual redirects

// Define paths that MUST remain PROTECTED (Blacklist)
const isProtectedRoute = createRouteMatcher([
  '/checkout(.*)', 
  '/profile(.*)', // 🔑 MODIFIED: Protecting /profile covers all sub-pages
  // We are NOT protecting the home page here, as per your implied structure.
]);

// Define paths that are part of the authentication/session process itself
const isAuthRoute = createRouteMatcher([
  '/login(.*)',
  '/sign-up(.*)',
  '/forgot-password(.*)',
  '/reset-password(.*)',
]);


export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 1. If the user is NOT signed in AND the route is protected, redirect to sign-in
  if (isProtectedRoute(req) && !userId) {
    return (await auth()).redirectToSignIn();
  }
  
  // 2. If the user IS signed in and tries to access the auth forms, redirect to Home Page
  if (userId && isAuthRoute(req)) {
      // 🔑 CLEANUP: Use simple NextResponse.redirect for cleaner UX redirect to the Home Page
      return NextResponse.redirect(new URL('/', req.url));
  }
});

// This matcher ensures the middleware runs on all relevant pages
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:css|js|png|jpg|jpeg|webp|gif|svg|ttf|woff|woff2|ico|csv|pdf|xml)).*)',
    '/(api|trpc)(.*)',
  ],
};