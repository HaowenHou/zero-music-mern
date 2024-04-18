import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyPassword } from '@/lib/auth';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        await dbConnect();

        const user = await User.findOne({ username: credentials.username });

        if (!user) {
          throw new Error('No user found with the entered username');
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Password is incorrect');
        }

        // Return user object on successful authentication
        return { id: user._id, name: user.username };
      }
    }),
  ],
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  pages: {
    signIn: '/auth/signin',  // Specifies the URL of the signin page.
    signOut: '/auth/signout', // Specifies the URL of the signout page.
    // error: '/auth/error', // Error page URL
  },
  callbacks: {
    jwt: async (token, user) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async (session, token) => {
      session.user.id = token.id;
      return session;
    },
  },
});