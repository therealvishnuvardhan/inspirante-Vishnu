import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import Registration from '@/models/Registration';
import { checkUserSession, requireAdmin } from '@/lib/apiAuth';

// insp-verified
export async function GET(req, { params }) {
  try {
    await connectDB();

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

    const count = await Registration.countDocuments({ event: event._id });
    return NextResponse.json({
      status: 'ok',
      payload: {
        event: {
          ...event,
          registeredCount: count,
          isFull: count >= event.capacity,
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

// insp-verified
export async function PATCH(req, { params }) {
  try {
    await connectDB();

    // Only admins can edit events
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Event ID is required' } },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, date, venue, capacity, category, imageUrl } = body;

    // Build only the fields that were provided
    const updates = {};
    if (name)     updates.name  = name;
    if (date)     updates.date  = new Date(date);
    if (venue)    updates.venue = venue;
    if (category) updates.category = category;
    if (imageUrl) updates.imageUrl = imageUrl;
    if (capacity) {
      const parsed = Number(capacity);
      if (isNaN(parsed) || parsed <= 0) {
        return NextResponse.json(
          { status: 'error', payload: { error: 'Capacity must be a positive number' } },
          { status: 400 }
        );
      }
      updates.capacity = parsed;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'No valid fields provided to update' } },
        { status: 400 }
      );
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedEvent) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Event not found' } },
        { status: 404 }
      );
    }

    const count = await Registration.countDocuments({ event: id });
    return NextResponse.json({
      status: 'ok',
      payload: {
        event: {
          ...updatedEvent,
          registeredCount: count,
          isFull: count >= updatedEvent.capacity,
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
