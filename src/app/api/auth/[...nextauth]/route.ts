import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await connectDB();
          
          const user = await User.findOne({ email: credentials.email });
          if (!user) return null;

          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) return null;

          // Check status for non-admin users
          if (user.type !== 'Admin' && user.status !== 'accepted') return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            type: user.type,
            role: user.role,
            status: user.status,
            avatar: user.avatar
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: { strategy: 'jwt' as const },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.name = user.name;
        token.type = user.type;
        token.role = user.role;
        token.status = user.status;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.name = token.name as string;
        session.user.type = token.type as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login'
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
