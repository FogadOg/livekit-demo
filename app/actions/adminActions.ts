"use server";

import roomService from "@/lib/roomService";
import { getIsAdmin } from "./roomActions";

export async function getAdminsRooms(rooms: string[]) {
  return await roomService.listRooms(rooms);
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
