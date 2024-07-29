"use server";

import roomService from "@/lib/roomService";
import prisma from "../../lib/prisma";
import { IngressClient, IngressInfo, IngressInput } from "livekit-server-sdk";

export async function deleteRoomIfEmpty(roomId: string) {
    const roomParticipants = await roomService.listParticipants(roomId);
    console.log("Room epmtpoadfjs");
    if (roomParticipants.length - 1 === 0) {
      await prisma.room.delete({ where: { id: Number(roomId) } });
      await roomService.deleteRoom(roomId);
    }
  }
  