import roomService from "@/lib/roomService"



export const getRoomMetadata = async (roomName: string) => {
  const room = (await roomService.listRooms([roomName]))[0]

  return room.metadata
}




