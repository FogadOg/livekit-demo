"use server";

import egressClient from "@/lib/egressClient";
import roomService from "@/lib/roomService";
import {
  AccessToken,
  EncodedFileOutput,
  RoomEgress,
  TokenVerifier,
  TrackSource,
} from "livekit-server-sdk";
import { filterActiveRooms } from "./adminActions";

export async function handleCreateRoomForm(
  roomName: string,
  roomCreateToken: string
) {
  const { valid, token, expired } = await validateToken(roomCreateToken);

  if (!valid || !token?.video?.roomCreate) {
    return { valid: false, expired: expired };
  }

  const roomNameTaken = (await filterActiveRooms([roomName])).length !== 0;
  if (roomNameTaken) {
    return { valid: true, roomNameTaken: true };
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  const at = new AccessToken(apiKey, apiSecret, { identity: "Admin" });

  const roomEgressRequest = {
    roomName: roomName,
    fileOutputs: [{ filepath: "/out/videos/" }],

    layout: "grid-dark",
    customBaseUrl: "http://172.17.0.1:3000/egress?",
    audioOnly: true,
  };

  const liveKitRoom = await roomService.createRoom({
    name: roomName,
    egress: new RoomEgress({ room: roomEgressRequest }),
  });

  const fileOutput = new EncodedFileOutput({
    filepath: "/out/videos/{room_name}-{time}",
  });

  egressClient.startRoomCompositeEgress(
    roomName,
    {
      file: fileOutput,
    },
    {
      layout: "grid-dark",
      customBaseUrl: "http://172.17.0.1:3000/egress?",
    }
  );

  at.addGrant({
    room: roomName,
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

  return { token: await at.toJwt(), newRoomId: roomName, valid: true };
}

// Returns room id to be used to check if name taken
export async function validateToken(permissionToken: string) {
  const tokenVerifier = new TokenVerifier(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
  );
  try {
    const token = await tokenVerifier.verify(permissionToken);

    // ? Do we need for this? throws error when invalid?
    if (!token) {
      console.error("Will this ever happened?");
      return { valid: false };
    }

    return {
      room: token.video?.room,
      token: token,
      valid: true,
      canSubscribe: token.video?.canSubscribe,
      hidden: token.video?.hidden,
    };
  } catch (error: any) {
    let roomId = error.payload?.video?.room as string;
    if (error.code! === "ERR_JWT_EXPIRED") {
      return { valid: false, expired: true, room: roomId };
    }

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
