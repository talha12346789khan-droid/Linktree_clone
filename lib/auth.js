import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

export const  { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Set multiple identifiers for reliability
      session.user.id = token.sub
      session.user.email = token.email || session.user?.email
      return session
    },
    async jwt({ token, user, account }) {
      // Ensure email is always in the token
      if (user?.email) {
        token.email = user.email
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
})
