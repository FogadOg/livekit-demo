"use server";

import roomService from "@/lib/roomService";
import prisma from "../../lib/prisma";
import { TokenVerifier } from "livekit-server-sdk";

export async function deleteRoomIfEmpty(roomId: string) {
  const roomParticipants = await roomService.listParticipants(roomId);
  const filteredParticipants = roomParticipants.filter(
    (participant) => !participant.permission?.agent
  );

  if (filteredParticipants.length === 0) {
    await prisma.room.delete({ where: { id: Number(roomId) } });
    await roomService.deleteRoom(roomId);
  }
}

export async function handleCreateRoomForm(formData: FormData) {
  const validatedFormData = {
    name: (formData.get("roomName") as string | null) || "default room",
    public: (formData.get("public") || "off") === "on",
    password: (formData.get("password") as string | null) || "",
  };

  const newRoom = await prisma.room.create({
    data: validatedFormData,
  });
  return `/room?roomId=${newRoom.id}`;
}

// Returns room id to be used to check if name taken
export async function validatePermissionToken(permissionToken: string) {
  const tokenVerifier = new TokenVerifier(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
  );
  try {
    const token = await tokenVerifier.verify(permissionToken);
    if (!token) {
      console.error("token not valid!");
      return false;
    }
    return token.video?.room;
  } catch {
    console.error("token not valid!");
    return false;
  }
}
