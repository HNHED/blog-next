import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      const isAdmin = user.email === process.env.ADMIN_EMAIL;
      return isAdmin;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email; // 初始登录时存入
      }
      return token;
    },
    async session({ session, token }) {
      // 将 GitHub 用户信息传递到 session
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.email = token.email as string; // 确保 session 里也有 email
      }
      return session;
    },
  },
})