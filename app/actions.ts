"use server";

import roomService from "@/lib/roomService";
import prisma from "../lib/prisma";

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

export async function checkUsernameTaken(roomId: string, username: string) {
  const participants = await roomService.listParticipants(roomId);
  const nameTaken = participants.some(
    (participant) => participant.identity === username
  );
  return nameTaken;
}

export async function handleCreateIngressForm(formData: FormData) {
  const validatedFormData = {
    roomName: (formData.get("roomName") as string | null) || "",
    username: (formData.get("username") as string | null) || "",
    password: (formData.get("password") as string | null) || "",
  };

  if (validatedFormData.roomName === "" || validatedFormData.username === "") {
    return { error: "We need roomName and username" };
  }

  return { url: "", password: "" };
}
