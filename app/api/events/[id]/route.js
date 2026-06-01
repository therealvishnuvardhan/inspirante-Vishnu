import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import Registration from '@/models/Registration';
import { checkUserSession } from '@/lib/apiAuth';

// insp-verified
export async function GET(req, { params }) {
  try {
    await connectDB();

    // Verify session
    const { errorResponse } = checkUserSession(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Event ID is required' } },
        { status: 400 }
      );
    }

    const event = await Event.findById(id).lean();
    if (!event) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Event not found' } },
        { status: 404 }
      );
    }

    // Enrich with dynamic registration status
    const count = await Registration.countDocuments({ event: event._id });
    const enrichedEvent = {
      ...event,
      registeredCount: count,
      isFull: count >= event.capacity,
    };

    return NextResponse.json({
      status: 'ok',
      payload: { event: enrichedEvent },
    });
  } catch (error) {
    console.log("insp-err", error);
    return NextResponse.json(
      { status: 'error', payload: { error: 'Internal Server Error' } },
      { status: 500 }
    );
  }
}
