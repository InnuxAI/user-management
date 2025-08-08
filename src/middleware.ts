import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin users can access all pages
    if (token?.type === 'Admin') {
      return;
    }

    // Role-based access control for regular users
    if (pathname.startsWith('/hr') && token?.role !== 'HR') {
      return NextResponse.redirect(new URL('/unauthorized?page=HR', req.url));
    }
    
    if (pathname.startsWith('/finance') && token?.role !== 'Finance') {
      return NextResponse.redirect(new URL('/unauthorized?page=Finance', req.url));
    }
    
    if (pathname.startsWith('/sales') && token?.role !== 'Sales') {
      return NextResponse.redirect(new URL('/unauthorized?page=Sales', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public routes
        if (pathname.startsWith('/auth') || pathname === '/' || pathname === '/unauthorized') {
          return true;
        }
        
        // Protected routes require authentication
        if (pathname.startsWith('/dashboard') || 
            pathname.startsWith('/hr') || 
            pathname.startsWith('/finance') || 
            pathname.startsWith('/sales') ||
            pathname.startsWith('/chat') ||
            pathname.startsWith('/search') ||
            pathname.startsWith('/rfq')) {
          return !!token;
        }
        
        // Admin routes require Admin type
        if (pathname.startsWith('/admin')) {
          return token?.type === 'Admin';
        }
        
        return true;
      }
    }
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*', '/hr/:path*', '/finance/:path*', '/sales/:path*', '/chat/:path*', '/search/:path*', '/rfq/:path*']
};
