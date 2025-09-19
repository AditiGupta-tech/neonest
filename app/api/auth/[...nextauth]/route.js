import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    AzureADProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      tenantId: "consumers", // only personal accounts
      authorization: { params: { scope: "openid profile email", prompt: "select_account" } },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email || profile.preferred_username,
          image: profile.picture,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Attach user info to token
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.id = profile.sub;
        token.name = profile.name || token.name;
        token.email = profile.email || profile.preferred_username || token.email;
        token.picture = profile.picture || token.picture;
      }
      return token;
    },

    // Make user info available in session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
