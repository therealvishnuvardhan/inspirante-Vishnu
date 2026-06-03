import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import Registration from '@/models/Registration';
import { requireAdmin, checkUserSession } from '@/lib/apiAuth';

// insp-verified
export async function GET(req) {
  try {
    await connectDB();

    // Verify session
    const { errorResponse } = checkUserSession(req);
    if (errorResponse) return errorResponse;

    // Get all events sorted by date ascending
    const events = await Event.find({}).sort({ date: 1 }).lean();

    // Aggregate registration counts in a single query
    const registrationCounts = await Registration.aggregate([
      { $group: { _id: '$event', count: { $sum: 1 } } }
    ]);
    const countsMap = new Map(registrationCounts.map(item => [item._id.toString(), item.count]));

    // Enrich events with registeredCount and isFull status
    const enrichedEvents = events.map((event) => {
      const count = countsMap.get(event._id.toString()) || 0;
      return {
        ...event,
        registeredCount: count,
        isFull: count >= event.capacity,
      };
    });

    return NextResponse.json({
      status: 'ok',
      payload: { events: enrichedEvents },
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
export async function POST(req) {
  try {
    await connectDB();

    // Verify admin session
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { name, date, venue, capacity, category, imageUrl } = await req.json();

    if (!name || !date || !venue || !capacity) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'All fields (name, date, venue, capacity) are required' } },
        { status: 400 }
      );
    }

    const parsedCapacity = Number(capacity);
    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      return NextResponse.json(
        { status: 'error', payload: { error: 'Capacity must be a positive number' } },
        { status: 400 }
      );
    }

    // Determine category and imageUrl defaults if not explicitly provided
    let finalCategory = category;
    let finalImageUrl = imageUrl;

    if (!finalCategory) {
      const lowerName = name.toLowerCase();
      if (
        lowerName.includes('tech') ||
        lowerName.includes('hackathon') ||
        lowerName.includes('code') ||
        lowerName.includes('workshop') ||
        lowerName.includes('react') ||
        lowerName.includes('dev') ||
        lowerName.includes('program')
      ) {
        finalCategory = 'Technical';
      } else {
        finalCategory = 'Non Technical';
      }
    }

    // Only use provided imageUrl, no defaults assigned
    // If no image is provided, it will show a black background

    const newEvent = await Event.create({
      name,
      date: new Date(date),
      venue,
      capacity: parsedCapacity,
      category: finalCategory,
      imageUrl: finalImageUrl,
    });

    return NextResponse.json(
      {
        status: 'ok',
        payload: {
          event: {
            ...newEvent.toObject(),
            registeredCount: 0,
            isFull: false,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("insp-err", error);
    return NextResponse.json(
      { status: 'error', payload: { error: 'Internal Server Error' } },
      { status: 500 }
    );
  }
}
