import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyPassword } from '@/lib/auth';

export default NextAuth({
  secret: process.env.AUTH_SECRET,
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
        return { id: user._id.toString(), username: user.username, name: user.name};
      }
    }),
  ],
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
    encryption: true,
  },
  callbacks: {
    jwt: async ({token, user}) => {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
      }
      return token;
    },
    session: async ({session, token}) => {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.name = token.name;
      // console.log(session); // {user: {id: '123', name: 'johndoe'}, expires: '1234567890'}
      // console.log(token); // includes name, sub, id, iat, exp, jti
      return session;
    },
  },
});