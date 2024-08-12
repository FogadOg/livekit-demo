"use server";

import prisma from "../../lib/prisma";
import roomService from "@/lib/roomService";
import { getRoomMetadata, addMetadataToRoom } from "./roomMetadata";

export async function appendTranscription(
  username: string,
  roomName: string,
  transcription: string
) {
  const room = (await roomService.listRooms([roomName]))[0];
  let metadata;

  if (room.metadata.length == 0) {
    metadata = {};
  } else {
    metadata = JSON.parse(JSON.parse(room.metadata)["transcript"]);
  }

  try {
    metadata[username] = metadata[username] + transcription;
  } catch {
    metadata[username] = transcription;
  }

  addMetadataToRoom(roomName, "transcript", JSON.stringify(metadata));
}

export const GetTranscription = async (roomName: string) => {
  const metadata = (await roomService.listRooms([roomName]))[0].metadata;
  const transcriptions = JSON.parse(metadata)["transcript"];

  return JSON.parse(transcriptions);
};
