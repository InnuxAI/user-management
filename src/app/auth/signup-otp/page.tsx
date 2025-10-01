'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { OTPSignupForm } from '@/components/auth/otp-signup-form';
import { toast } from 'sonner';

export default function OTPSignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Account created successfully! Please wait for admin approval.');
        router.push('/auth/login');
      } else {
        toast.error(result.message || 'An error occurred during signup');
      }
    } catch (error) {
      toast.error('An error occurred during signup');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Join Innux AI
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your account with email verification
          </p>
        </div>
        
        <OTPSignupForm onSubmit={handleSignup} isLoading={isLoading} />
        
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Want to use the simple signup?{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:text-primary/80">
              Basic Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
