import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get('roomId');

  if (!roomId) {
    return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
  }

  try {
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) }, // Ensure roomId is an integer
      select: { password: true },
    });

    if (room) {
      return NextResponse.json({ password: room.password });
    } else {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching room password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
