"use server";

import roomService from "../../lib/roomService";
import prisma from "../../lib/prisma";
import {
  AccessToken,
  EgressClient,
  EncodedFileOutput,
  VideoGrant,
} from "livekit-server-sdk";

import {
  getIsAdmin,
  tokenFromPermissionToken,
  validateToken,
} from "./roomActions";
import { addMetadataToRoom } from "./roomMetadata";

export async function checkUsernameTaken(roomId: string, username: string) {
  const participants = await roomService.listParticipants(roomId);
  const nameTaken = participants.some(
    (participant) => participant.identity === username
  );
  return nameTaken;
}

const egressClient = new EgressClient(
  process.env.NEXT_PUBLIC_LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export async function toggleRecording(roomId: string, token: string) {
  const isAdmin = await getIsAdmin(token);
  if (!isAdmin) {
    console.log("You are not admin!");
    return false;
  }
  const room = (await roomService.listRooms([roomId]))[0];
  if (!room) {
    return false;
  }

  const egressId =
    (room?.metadata && JSON.parse(room.metadata)?.egressId) || "";

  if (egressId === "") {
    console.log("Creating Egress");
    const fileOutput = new EncodedFileOutput({
      filepath: `/out/videos/{room_name}-${room.name}.mp4`,
    });

    const info = await egressClient.startRoomCompositeEgress(
      roomId,
      {
        file: fileOutput,
      },
      {
        layout: "grid-dark",
        customBaseUrl: "http://172.17.0.1:3000/egress?",
      }
    );

    await addMetadataToRoom(room.name, "egressId", info.egressId);
  } else {
    await egressClient.stopEgress(egressId);
    await addMetadataToRoom(room.name, "egressId", "");
  }
}

// This is used to generate token for invite link
// The invite link will use it's permissions and add identity
export async function generatePermissionToken(
  room: string,
  permissions: VideoGrant,
  token: string
) {
  const isAdmin = await getIsAdmin(token);
  if (!isAdmin) {
    console.log("You are not admin!");
    return false;
  }
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  const at = new AccessToken(apiKey, apiSecret, { ttl: "5m" });
  // Removing roomJoin and canSubscribe
  const { roomJoin, canSubscribe, ...videoGrant } = permissions;

  at.addGrant({
    room,
    roomJoin: false,
    canSubscribe: false,
    ...permissions,
  });

  return await at.toJwt();
}

export async function updateParticipantPermissions(
  participantIdentity: string,
  token: string,
  newPermissions: VideoGrant
) {
  const isAdmin = await getIsAdmin(token);
  if (!isAdmin) {
    console.log("You are not admin!");
    return false;
  }
  let { token: validatedToken } = await validateToken(token);

  const roomName = validatedToken?.video?.room;

  const partiInfo = await roomService.updateParticipant(
    roomName!,
    participantIdentity,
    undefined,
    newPermissions
  );
}

// Can still join with same token
export async function kickParticipant(
  participantIdentity: string,
  token: string
) {
  const isAdmin = await getIsAdmin(token);
  if (!isAdmin) {
    console.log("You are not admin!");
    return false;
  }
  let { token: validatedToken } = await validateToken(token);

  const roomName = validatedToken?.video?.room;

  await updateParticipantPermissions(participantIdentity, token, {
    room: roomName,
    roomJoin: false,
    canSubscribe: false,
  });

  await roomService.removeParticipant(
    validatedToken?.video?.room!,
    participantIdentity
  );
}

export async function getRoomState(roomId: string) {
  const room = await prisma.room.findUnique({
    where: { id: Number(roomId) },
    select: { password: true, name: true, public: true },
  });

  if (room) {
    return { roomPublic: room.public, valid: true };
  } else {
    return { valid: false };
  }
}

export async function validatedRoomPasswordAndUsername(
  roomId: string,
  username: string,
  permissionToken: string
) {
  const room = await prisma.room.findUnique({
    where: { id: Number(roomId) },
    select: { password: true, name: true, public: true },
  });

  if (!room) {
    return { valid: false, message: "Something went wrong try to refresh" };
  }

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
