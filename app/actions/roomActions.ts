"use server";

import roomService from "@/lib/roomService";
import prisma from "../../lib/prisma";

export async function deleteRoomIfEmpty(roomId: string) {
    const roomParticipants = await roomService.listParticipants(roomId);
    console.log("Room epmtpoadfjs");
    if (roomParticipants.length - 1 === 0) {
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