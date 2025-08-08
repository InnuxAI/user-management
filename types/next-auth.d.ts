import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      role: string;
      status: string;
      avatar?: string; 
      menuPermissions: string[];
    } & DefaultSession['user'];
  }

  interface User {
    name: string;
    role: string;
    status: string;
    avatar?: string;
    menuPermissions: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    name: string;
    role: string;
    status: string;
    avatar?: string;
    menuPermissions: string[];
  }
}
