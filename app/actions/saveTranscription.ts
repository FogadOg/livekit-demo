"use server";
import prisma from "../../lib/prisma";

export async function appendTranscription(
  username: string,
  roomId: number,
  transcription: string
) {
  // roomId and name should be unique to one user
  let user = await prisma.user.findFirst({
    where: { name: username, room: { id: roomId } },
  });

  // Creating user if not exist
  if (!user) {
    user = await prisma.user.create({
      data: { name: username, roomId: roomId },
    });
  }

  // Appending transcription
  await prisma.user.update({
    where: { id: user.id },
    data: { transcription: user.transcription + transcription },
  });
}
