"use server";

import prisma from "../../lib/prisma";
import roomService from "@/lib/roomService";

export async function appendTranscription(
  username: string,
  roomName: string,
  transcription: string
) {  
  const room = (await roomService.listRooms([roomName]))[0]
  let metadata

  if (room.metadata.length == 0){
    metadata = {}
  }else {
    metadata = JSON.parse(room.metadata)
  }

  if(metadata[username] === undefined) {
    metadata[username] = transcription
  }else{
    metadata[username] = metadata[username] +transcription
  }
  roomService.updateRoomMetadata(roomName, JSON.stringify(metadata))
  
  

}

export const GetTranscription = async (roomId: number) => {
  const users = await prisma.user.findMany({ where: { roomId: roomId } });
  return users;
};
