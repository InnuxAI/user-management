import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      type: string;
      role?: string;
      status: string;
      avatar?: string; 
    } & DefaultSession['user'];
  }

  interface User {
    name: string;
    type: string;
    role?: string;
    status: string;
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    name: string;
    type: string;
    role?: string;
    status: string;
    avatar?: string;
  }
}
