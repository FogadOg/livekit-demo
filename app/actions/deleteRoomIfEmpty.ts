"use server";

import roomService from "@/lib/roomService";
import prisma from "../../lib/prisma";
import { IngressClient, IngressInfo, IngressInput } from "livekit-server-sdk";


export async function checkUsernameTaken(roomId: string, username: string) {
  const participants = await roomService.listParticipants(roomId);
  const nameTaken = participants.some(
    (participant) => participant.identity === username
  );
  return nameTaken;
}

export async function handleCreateIngressForm(formData: FormData) {
  const validatedFormData = {
    roomId: (formData.get("roomId") as string | null) || "",
    username: (formData.get("username") as string | null) || "",
    password: (formData.get("password") as string | null) || "",
  };

  if (validatedFormData.roomId === "" || validatedFormData.username === "") {
    return { error: "We need room name and username" };
  }

  if (isNaN(+validatedFormData.roomId)) {
    return { error: "Room id must be number" };
  }

  const room = await prisma.room.findFirst({
    where: { id: Number(validatedFormData.roomId) },
  });
  if (!room) {
    return {
      error: "Found no room with that id",
    };
  }
  if (!room.public && room.password != validatedFormData.password) {
    return { error: "Wrong room password" };
  }

  const nameTaken = await checkUsernameTaken(
    validatedFormData.username,
    validatedFormData.username
  );

  if (nameTaken) {
    return { error: "Username taken" };
  }

  // Creating ingress
  const ingressClient = new IngressClient(
    process.env.NEXT_PUBLIC_LIVEKIT_URL!,
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
  );
  const ingressRequest = {
    name: "my-ingress",
    roomName: validatedFormData.roomId,
    participantIdentity: validatedFormData.username,
    participantName: validatedFormData.username,
    enableTranscoding: true,
  };

  const ingressData = await ingressClient.createIngress(
    IngressInput.RTMP_INPUT,
    ingressRequest
  );

  return { url: ingressData.url, password: ingressData.streamKey };
}
