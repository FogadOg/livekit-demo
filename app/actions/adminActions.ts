"use server";

import roomService from "@/lib/roomService";
import { getIsAdmin } from "./roomActions";
import { IngressInput, Room } from "livekit-server-sdk";
import ingressClient from "@/lib/ingerssClient";

// Get rooms and returns only active ones
export async function filterActiveRooms(roomNames: string[]) {
  if (roomNames.length === 0) return [];
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
