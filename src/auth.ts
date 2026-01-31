import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user }) {
      const isAdmin = user.email === process.env.ADMIN_EMAIL;
      return isAdmin;
    },
    async session({ session, token }) {
      // 将 GitHub 用户信息传递到 session
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
})