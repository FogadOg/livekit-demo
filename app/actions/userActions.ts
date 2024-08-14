"use server";

import roomService from "@/lib/roomService";
import { AccessToken } from "livekit-server-sdk";
import { tokenFromPermissionToken } from "./roomActions";

export async function checkUsernameTaken(roomId: string, username: string) {
  const participants = await roomService.listParticipants(roomId);
  const nameTaken = participants.some(
    (participant) => participant.identity === username
  );
  return nameTaken;
}

export async function getRoomState(roomId: string) {
  const room = await roomService.listRooms([roomId]);

  if (room.length !== 0) {
    return { valid: true };
  } else {
    return { valid: false };
  }
}

export async function validatedRoomPasswordAndUsername(
  roomId: string,
  username: string,
  permissionToken: string
) {
  const participants = await roomService.listParticipants(roomId);
  const usernameTaken = participants.some((p) => {
    return username === p.identity || username === "Admin";
  });

  if (usernameTaken) {
    return { valid: false, message: "Username taken" };
  }

  return {
    valid: true,
    message: "",
    token: await tokenFromPermissionToken(permissionToken, username),
  };
}

export async function getCreateToken(password: string) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (password !== process.env.ADMIN_PASSWORD) {
    return { valid: false };
  }
  // No ttl? Require login on empty?
  const at = new AccessToken(apiKey, apiSecret);

  at.addGrant({
    roomJoin: false,
    canSubscribe: false,
    roomCreate: true,
  });

  return { valid: true, token: await at.toJwt() };
}

// !Not secure? can change particpant id to admin and steal permissions
// ? If passing in previous token instead of id it will be secure

// Updates token when user get's new permissions
export async function updateTokenToFitPermissions(
  roomId: string,
  participantId: string
) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    const participant = await roomService.getParticipant(roomId, participantId);

    const at = new AccessToken(apiKey, apiSecret, { identity: participantId });

    at.addGrant({
      room: roomId,
      roomJoin: true,
      canSubscribe: true,
      roomCreate: false,
      ...participant.permission,
    });

    return { valid: true, token: await at.toJwt() };
  } catch (error) {
    console.log("-------------------", error);
    return { valid: false };
  }
}
