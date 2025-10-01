'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success('Login successful');
        router.push('/dashboard');
      } else {
        toast.error('Invalid credentials or account not approved');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:text-primary/80">
              Sign up
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Want secure signup?{' '}
            <Link href="/auth/signup-otp" className="font-medium text-primary hover:text-primary/80">
              OTP Verification
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
