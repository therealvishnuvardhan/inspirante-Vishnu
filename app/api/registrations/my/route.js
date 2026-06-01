import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { checkUserSession } from '@/lib/apiAuth';

// Initialize Event model schema registration so populating event subdocument works
import '@/models/Event';

// insp-verified
export async function GET(req) {
  try {
    await connectDB();

    // Verify session
    const { user, errorResponse } = checkUserSession(req);
    if (errorResponse) return errorResponse;

    // Enforce student role
    if (user.role !== 'student') {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Forbidden: Admins do not have personal registrations' } },
        { status: 403 }
      );
    }

    // Get all registrations for this student, populate event details
    const registrations = await Registration.find({ student: user.id })
      .populate('event')
      .sort({ registeredAt: -1 })
      .lean();

    return NextResponse.json({
      status: 'ok',
      payload: { registrations },
    });
  } catch (error) {
    console.log("insp-err", error);
    return NextResponse.json(
      { status: 'error', payload: { error: 'Internal Server Error' } },
      { status: 500 }
    );
  }
}
