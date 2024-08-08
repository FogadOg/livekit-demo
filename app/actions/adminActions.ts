"use server";

import roomService from "@/lib/roomService";
import { getIsAdmin } from "./roomActions";
import { IngressClient, IngressInput, Room } from "livekit-server-sdk";

// Get rooms and returns only active ones
export async function filterActiveRooms(roomNames: string[]) {
  return await roomService.listRooms(roomNames);
}

export async function deleteRoom(token: string, room: string) {
  const isAdmin = await getIsAdmin(token);
  if (!isAdmin) {
    console.log("You are not admin!");
    return false;
  }

  const roomExist = (await roomService.listRooms([room])).length === 1;
  if (roomExist) {
    await roomService.deleteRoom(room);
  }
  return true;
}
// Creating ingress
const ingressClient = new IngressClient(
  process.env.NEXT_PUBLIC_LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export async function createIngress(
  token: string,
  room: Room,
  username: string
) {
  const isAdmin = await getIsAdmin(token);
  if (!isAdmin) {
    console.log("You are not admin!");
    return { valid: false };
  }

  const currentTimeStamp = Date.now();

  const ingressRequest = {
    name: "my-ingress",
    roomName: room.name,
    participantIdentity: `${username}-${currentTimeStamp}`,
    participantName: username,
    enableTranscoding: true,
  };

  const ingressData = await ingressClient.createIngress(
    IngressInput.RTMP_INPUT,
    ingressRequest
  );

  return { valid: true, url: ingressData.url, password: ingressData.streamKey };
}
