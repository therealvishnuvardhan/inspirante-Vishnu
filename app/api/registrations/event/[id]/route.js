import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { requireAdmin } from '@/lib/apiAuth';

// Initialize User model schema registration so populating student subdocument works
import '@/models/User';

// insp-verified
export async function GET(req, { params }) {
  try {
    await connectDB();

    // Verify admin session
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Event ID is required' } },
        { status: 400 }
      );
    }

    // Find all registrations for the event, populate student details (name and username)
    const registrations = await Registration.find({ event: id })
      .populate('student', 'name username')
      .sort({ registeredAt: 1 })
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
