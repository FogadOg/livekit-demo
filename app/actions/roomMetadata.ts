"use server"

import roomService from "@/lib/roomService"
import { json } from "stream/consumers";




export const getRoomMetadata = async (roomName: string) => {
  const room = (await roomService.listRooms([roomName]))[0]

  return JSON.parse(room.metadata)
}

export const setRoomMetadata = async (roomName: string, fieldName: string, newData: any) => {
    const metadata = await getRoomMetadata(roomName)
    let metadataObject
    if(metadata == "") {
        metadataObject = {}
    } else {
        metadataObject = metadata
    }
    metadataObject[fieldName] = newData

    roomService.updateRoomMetadata(roomName, JSON.stringify(newData))
    console.log("getRoomMetadata: ",getRoomMetadata(roomName));
    
}
