import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendAdminEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).type !== 'Admin') {
      return NextResponse.json(
        { message: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const { email, subject, body } = await request.json();

    if (!email || !subject || !body) {
      return NextResponse.json(
        { message: 'Email, subject, and body are required' }, 
        { status: 400 }
      );
    }

    // Add [ADMIN] prefix to subject
    const adminSubject = `[ADMIN] ${subject}`;

    const emailSent = await sendAdminEmail(email, adminSubject, body);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
