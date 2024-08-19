"use server";

import roomService from "@/lib/roomService";
import { getIsAdmin } from "./roomActions";

export const getRoomMetadata = async (roomName: string) => {
  try{
    const rooms = (await roomService.listRooms([roomName]));
    const room = rooms[0]
  
    return JSON.parse(room.metadata)

  } catch {
    return {}
  }
};

export const addMetadataToRoom = async (
  roomName: string,
  fieldName: string,
  newData: any
) => {
  const metadata = await getRoomMetadata(roomName);

  metadata[fieldName] = newData;
  
  try{
    await roomService.updateRoomMetadata(
      roomName,
      JSON.stringify(metadata)
    );
  }catch{}
};

export const changeMetaDataToParticipant = async (
  roomName: string,
  participantId: string,
  data: string,
  token: string
) => {
  if (await getIsAdmin(token)) {
    await roomService.updateParticipant(roomName, participantId, data);
  }
};
