import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.is_admin = (user as any).is_admin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).is_admin = token.is_admin;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;//ダッシュボードにアクセスできる
        return false; // 未認証のユーザーをログインページにリダイレクトします
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // 今のところは空の配列でプロバイダーを追加
} satisfies NextAuthConfig;
