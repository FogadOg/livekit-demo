"use server";

import roomService from "@/lib/roomService";
import prisma from "../../lib/prisma";
import { AccessToken, TokenVerifier, TrackSource } from "livekit-server-sdk";

export async function deleteRoomIfEmpty(roomId: string) {
  const roomParticipants = await roomService.listParticipants(roomId);
  const filteredParticipants = roomParticipants.filter(
    (participant) => !participant.permission?.agent
  );

  if (filteredParticipants.length === 0) {
    await prisma.room.delete({ where: { id: Number(roomId) } });
    await roomService.deleteRoom(roomId);
  }
}

export async function handleCreateRoomForm(
  formData: FormData,
  roomCreateToken: string
) {
  const { valid, token, expired } = await validateToken(roomCreateToken);

  if (!valid || !token?.video?.roomCreate) {
    return { valid: false, expired: expired };
  }

  const validatedFormData = {
    name: (formData.get("roomName") as string | null) || "default room",
    public: (formData.get("public") || "off") === "on",
    password: (formData.get("password") as string | null) || "",
  };

  const newRoom = await prisma.room.create({
    data: validatedFormData,
  });

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  const at = new AccessToken(apiKey, apiSecret, { identity: "Admin" });
  at.addGrant({
    room: newRoom.id.toString(),
    roomCreate: true,
    roomJoin: true,
    canSubscribe: true,
    canPublish: true,
    roomAdmin: true,
    roomRecord: true,
    canPublishSources: [
      TrackSource.CAMERA,
      TrackSource.MICROPHONE,
      TrackSource.SCREEN_SHARE,
      TrackSource.SCREEN_SHARE_AUDIO,
    ],
  });
  return { path: `/room?adminToken=${await at.toJwt()}`, valid: true };
}

// Returns room id to be used to check if name taken
export async function validateToken(permissionToken: string) {
  const tokenVerifier = new TokenVerifier(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
  );
  try {
    const token = await tokenVerifier.verify(permissionToken);

    // Current time (in seconds since epoch)
    const currentTime = Math.floor(Date.now() / 1000);

    if (!token) {
      console.error("token not valid!");
      return { valid: false };
    }

    if (currentTime > token.exp!) {
      return { valid: false, expired: true };
    }
    return { room: token.video?.room, token: token, valid: true };
  } catch {
    console.error("token not valid!");
    return { valid: false };
  }
}

// Generating real token from
export async function tokenFromPermissionToken(
  permissionToken: string,
  userId: string
) {
  const { valid, token } = await validateToken(permissionToken);

  if (!valid) {
    return;
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  const at = new AccessToken(apiKey, apiSecret, { identity: userId });
  // remove roomJoin from token video, make sure they are always true
  const { roomJoin, canSubscribe, canPublishSources, ...videoGrant } =
    token?.video || {};

  const stringToTrackSourceMap: { [key: string]: TrackSource } = {
    camera: TrackSource.CAMERA,
    microphone: TrackSource.MICROPHONE,
    screen_share: TrackSource.SCREEN_SHARE,
    screen_share_audio: TrackSource.SCREEN_SHARE_AUDIO,
  };

  // Need to convert sources from strings to int, why though?
  let convertedSources = canPublishSources?.map(
    (v) => stringToTrackSourceMap[v]
  );
  at.addGrant({
    roomCreate: false,
    roomJoin: true,
    canSubscribe: true,
    canPublishSources: convertedSources,
    ...videoGrant,
  });

  return await at.toJwt();
}

export async function getIsAdmin(token: string): Promise<boolean> {
  let { valid, token: validatedToken } = await validateToken(token);
  if (!valid) {
    return false;
  }
  return validatedToken?.video?.roomAdmin || false;
}
