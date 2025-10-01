import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, password, adminCreated } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' }, 
        { status: 400 }
      );
    }

    await connectDB();
    
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: 'User already exists' }, 
        { status: 400 }
      );
    }

    // Check if this is the first user - if so, make them an admin
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      email, 
      password: hashedPassword, 
      type: isFirstUser ? 'Admin' : 'User',
      role: isFirstUser ? 'super' : undefined,
      status: (isFirstUser || adminCreated) ? 'accepted' : 'pending'
    });
    await user.save();

    return NextResponse.json(
      { 
        message: isFirstUser ? 'Admin account created successfully' : 
                adminCreated ? 'User account created successfully by admin' :
                'User created successfully. Please wait for admin approval.',
        isFirstUser,
        userId: user._id
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
