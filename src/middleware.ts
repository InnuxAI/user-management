import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public routes
        if (pathname.startsWith('/auth') || pathname === '/') {
          return true;
        }
        
        // Protected routes require authentication
        if (pathname.startsWith('/dashboard')) {
          return !!token;
        }
        
        // Admin routes require admin role
        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }
        
        return true;
      }
    }
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*']
};
