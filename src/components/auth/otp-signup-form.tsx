'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Shield, CheckCircle } from 'lucide-react';

interface OTPSignupFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  isLoading: boolean;
}

export function OTPSignupForm({ onSubmit, isLoading }: OTPSignupFormProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'details'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Only Gmail addresses are allowed for registration');
      return;
    }

    setSendingOTP(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'send' })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Verification code sent to your email');
        setStep('otp');
      } else {
        setError(result.error || 'Failed to send verification code');
      }
    } catch (error) {
      setError('An error occurred while sending verification code');
    }

    setSendingOTP(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Verification code is required');
      return;
    }

    setVerifyingOTP(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, action: 'verify' })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Email verified successfully');
        setStep('details');
      } else {
        setError(result.error || 'Invalid verification code');
      }
    } catch (error) {
      setError('An error occurred while verifying code');
    }

    setVerifyingOTP(false);
  };

  const handleSignup = () => {
    if (!password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    onSubmit({ email, password });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          {step === 'email' && 'Enter your Gmail address to get started'}
          {step === 'otp' && 'Enter the verification code sent to your email'}
          {step === 'details' && 'Set your account password'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {step === 'email' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={sendingOTP}
              />
              <p className="text-sm text-muted-foreground">
                Only Gmail addresses are accepted
              </p>
            </div>
            <Button 
              onClick={handleSendOTP} 
              disabled={sendingOTP}
              className="w-full"
            >
              {sendingOTP ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Verification Code
                </>
              )}
            </Button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={verifyingOTP}
                maxLength={6}
              />
              <p className="text-sm text-muted-foreground">
                Check your email for the verification code
              </p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={handleVerifyOTP} 
                disabled={verifyingOTP}
                className="w-full"
              >
                {verifyingOTP ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Code
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setStep('email')}
                className="w-full"
              >
                Change Email
              </Button>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={handleSignup} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
