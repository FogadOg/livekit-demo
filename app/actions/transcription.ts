"use server";

import roomService from "@/lib/roomService";
import { addMetadataToRoom, getRoomMetadata } from "./metadataAction";

export async function appendTranscription(
  username: string,
  roomName: string,
  transcription: string
) {
  const userTranscript = await getUsersTranscript(roomName);
  try {
    userTranscript[username] += transcription;
  } catch {
    userTranscript[username] = transcription;
  }

  addMetadataToRoom(roomName, "transcript", userTranscript);
}

async function getUsersTranscript(roomName: string) {
  const room = (await roomService.listRooms([roomName]))[0];

  const roomMetadata = await getRoomMetadata(room.name);
  if (Object.keys(roomMetadata).length === 0 || !roomMetadata["transcript"]) {
    return {};
  }
  return roomMetadata["transcript"];
}

export const GetTranscription = async (roomName: string) => {
  const metadata = (await roomService.listRooms([roomName]))[0].metadata;
  const transcriptions = JSON.parse(metadata)["transcript"];

  return JSON.parse(transcriptions);
};
