import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import Registration from '@/models/Registration';
import { checkUserSession } from '@/lib/apiAuth';

// insp-verified
export async function POST(req) {
  try {
    await connectDB();

    // Verify session
    const { user, errorResponse } = checkUserSession(req);
    if (errorResponse) return errorResponse;

    // Enforce student role
    if (user.role !== 'student') {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Forbidden: Admins cannot register for events' } },
        { status: 403 }
      );
    }

    const { eventId } = await req.json();
    if (!eventId) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Event ID is required' } },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Event not found' } },
        { status: 404 }
      );
    }

    // Check if student has already registered (prevent duplicate registrations)
    const existingRegistration = await Registration.findOne({
      student: user.id,
      event: eventId,
    });

    if (existingRegistration) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'You are already registered for this event' } },
        { status: 409 }
      );
    }

    // Check capacity
    const registeredCount = await Registration.countDocuments({ event: eventId });
    if (registeredCount >= event.capacity) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Event has reached its maximum capacity' } },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await Registration.create({
      student: user.id,
      event: eventId,
    });

    return NextResponse.json({
      status: 'ok',
      payload: { registration },
    });
  } catch (error) {
    console.log("insp-err", error);
    // Compound key unique constraint violation handler in case of race conditions
    if (error.code === 11000) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'You are already registered for this event' } },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { status: 'error', payload: { error: 'Internal Server Error' } },
      { status: 500 }
    );
  }
}
