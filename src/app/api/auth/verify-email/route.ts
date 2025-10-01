import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, sendOTPEmail, isGmailEmail } from '@/lib/email';

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expires: number; email: string }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action, otp } = body;

    if (!email || !action) {
      return NextResponse.json(
        { error: 'Email and action are required' },
        { status: 400 }
      );
    }

    // Check if email is Gmail
    if (!isGmailEmail(email)) {
      return NextResponse.json(
        { error: 'Only Gmail addresses are allowed for registration' },
        { status: 400 }
      );
    }

    if (action === 'send') {
      // Generate and send OTP
      const otpCode = generateOTP();
      const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Store OTP
      otpStore.set(email, { otp: otpCode, expires, email });

      // Send email
      const emailSent = await sendOTPEmail(email, otpCode);

      if (!emailSent) {
        return NextResponse.json(
          { error: 'Failed to send verification email' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: 'Verification code sent successfully' },
        { status: 200 }
      );

    } else if (action === 'verify') {
      if (!otp) {
        return NextResponse.json(
          { error: 'OTP is required' },
          { status: 400 }
        );
      }

      const storedData = otpStore.get(email);

      if (!storedData) {
        return NextResponse.json(
          { error: 'No OTP found for this email' },
          { status: 400 }
        );
      }

      if (Date.now() > storedData.expires) {
        otpStore.delete(email);
        return NextResponse.json(
          { error: 'OTP has expired' },
          { status: 400 }
        );
      }

      if (storedData.otp !== otp) {
        return NextResponse.json(
          { error: 'Invalid OTP' },
          { status: 400 }
        );
      }

      // OTP verified successfully, remove from store
      otpStore.delete(email);

      return NextResponse.json(
        { message: 'Email verified successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
