"use server";

import roomService from "@/lib/roomService";
import prisma from "../lib/prisma";

export async function handleCreateRoomForm(formData: FormData) {
  const validatedFormData = {
    name: (formData.get("roomName") as string | null) || "default room",
    public: (formData.get("public") || "off") === "on",
  };

  const newRoom = await prisma.room.create({
    data: validatedFormData,
  });
  return `/room?roomId=${newRoom.id}&username=Creator`;
}

export async function usernameTaken(roomId: string, username: string) {
  console.log("Checking if user here!");
  const participants = await roomService.listParticipants(roomId);
  const nameTaken = participants.some(
    (participant) => participant.identity === username
  );
  console.log(nameTaken);
  return nameTaken;
}
