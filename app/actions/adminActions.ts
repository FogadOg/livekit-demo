"use server";

import roomService from "@/lib/roomService";

export async function getAdminsRooms(rooms: string[]) {
  return await roomService.listRooms(rooms);
}
