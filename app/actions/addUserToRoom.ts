import prisma from '../../lib/prisma';

export async function addUserToRoom(userId: number, roomId: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!user || !room) {
      throw new Error('User or Room not found');
    }

    const roomOnUser = await prisma.roomOnUser.create({
      data: {
        userId,
        roomId,
      },
    });

    return roomOnUser;
  } catch (error) {
    console.error('Error adding user to room:', error);
    throw new Error('Failed to add user to room');
  }
}
