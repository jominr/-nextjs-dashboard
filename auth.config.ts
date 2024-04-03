import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  // 验证失败后返回的路径
  pages: {
    signIn: '/login',
  },
  
  callbacks: {
    // 页面切换时进行授权验证，request解构
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // 是否请求的是dashboard页面
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      // 这里为什么return true? 
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;