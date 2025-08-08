import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    await connectDB();
    console.log('Database connected successfully');
    
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    console.log('Found users:', users.length);
    
    return NextResponse.json({ 
      success: true, 
      userCount: users.length,
      users: users
    }, { status: 200 });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
