"use server";

import roomService from "@/lib/roomService";

export const getRoomMetadata = async (roomName: string) => {
  const room = (await roomService.listRooms([roomName]))[0];

  return room.metadata;
};

export const addMetadataToRoom = async (
  roomName: string,
  fieldName: string,
  newData: any
) => {
  const metadata = await getRoomMetadata(roomName);

  let metadataObject;
  if (metadata == "") {
    metadataObject = {};
  } else {
    metadataObject = JSON.parse(metadata);
  }
  metadataObject[fieldName] = newData;

  roomService.updateRoomMetadata(roomName, JSON.stringify(metadataObject));
};
