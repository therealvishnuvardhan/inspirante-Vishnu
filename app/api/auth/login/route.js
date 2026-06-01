import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

// insp-verified
export async function POST(req) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Username and password are required' } },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Invalid username or password' } },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Invalid username or password' } },
        { status: 401 }
      );
    }

    const token = signToken({
      id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
    });

    return NextResponse.json({
      status: 'ok',
      payload: {
        token,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.log("insp-err", error);
    return NextResponse.json(
      { status: 'error', payload: { error: 'Internal Server Error' } },
      { status: 500 }
    );
  }
}
