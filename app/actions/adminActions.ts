"use server";

import roomService from "@/lib/roomService";
import { getIsAdmin, validateToken } from "./roomActions";
import {
  AccessToken,
  CreateIngressOptions,
  EncodedFileOutput,
  IngressInput,
  Room,
  VideoGrant,
} from "livekit-server-sdk";
import ingressClient from "@/lib/ingerssClient";
import { addMetadataToRoom } from "./metadataAction";
import egressClient from "@/lib/egressClient";
import { metadata } from "../layout";

// Get rooms and returns only active ones
export async function filterActiveRooms(roomNames: string[]) {
  if (roomNames.length === 0) return [];
  return (await roomService.listRooms(roomNames)).map((room) => {
    return { name: room.name, numParticipants: room.numParticipants };
  });
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

export async function createIngress(
  token: string,
  roomName: string,
  username: string,
  metadata: string
) {
  const isAdmin = await getIsAdmin(token);
  if (!isAdmin) {
    console.log("You are not admin!");
    return { valid: false };
  }

  const currentTimeStamp = Date.now();

  const ingressRequest: CreateIngressOptions = {
    name: "my-ingress",
    roomName: roomName,
    participantIdentity: `${username}-${currentTimeStamp}`,
    participantName: username,
    enableTranscoding: true,
    participantMetadata: metadata,
  };

  const ingressData = await ingressClient.createIngress(
    IngressInput.RTMP_INPUT,
    ingressRequest
  );

  return { valid: true, url: ingressData.url, password: ingressData.streamKey };
}

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

  if (egressId === "" && !room.activeRecording) {
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

  const at = new AccessToken(apiKey, apiSecret, { ttl: "3h" });
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

  await roomService.updateParticipant(
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

export async function muteTrack(
  roomId: string,
  participantIdentity: string,
  trackSid: string,
  muted: boolean,
  token: string
) {
  if (await getIsAdmin(token)) {
    await roomService.mutePublishedTrack(
      roomId,
      participantIdentity,
      trackSid,
      muted
    );
  }
}
