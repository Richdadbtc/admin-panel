import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user has admin role
        if (req.nextUrl.pathname.startsWith('/dashboard') ||
            req.nextUrl.pathname.startsWith('/users') ||
            req.nextUrl.pathname.startsWith('/quizzes') ||
            req.nextUrl.pathname.startsWith('/analytics') ||
            req.nextUrl.pathname.startsWith('/transactions') ||
            req.nextUrl.pathname.startsWith('/settings')) {
          return token?.role === 'admin'
        }
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/users/:path*', '/quizzes/:path*', '/analytics/:path*', '/transactions/:path*', '/settings/:path*']
}