"use server";

import roomService from "../../lib/roomService";
import prisma from "../../lib/prisma";
import {
  AccessToken,
  EgressClient,
  EncodedFileOutput,
  IngressClient,
  IngressInput,
  VideoGrant,
} from "livekit-server-sdk";

import { TokenVerifier } from "livekit-server-sdk";
import { getIsAdmin, validateToken } from "./roomActions";

export async function checkUsernameTaken(roomId: string, username: string) {
  const participants = await roomService.listParticipants(roomId);
  const nameTaken = participants.some(
    (participant) => participant.identity === username
  );
  return nameTaken;
}

export async function handleCreateIngressForm(formData: FormData) {
  const validatedFormData = {
    roomId: (formData.get("roomId") as string | null) || "",
    username: (formData.get("username") as string | null) || "",
    password: (formData.get("password") as string | null) || "",
  };

  if (validatedFormData.roomId === "" || validatedFormData.username === "") {
    return { error: "We need room name and username" };
  }

  if (isNaN(+validatedFormData.roomId)) {
    return { error: "Room id must be number" };
  }

  const room = await prisma.room.findFirst({
    where: { id: Number(validatedFormData.roomId) },
  });
  if (!room) {
    return {
      error: "Found no room with that id",
    };
  }
  if (!room.public && room.password != validatedFormData.password) {
    return { error: "Wrong room password" };
  }

  const nameTaken = await checkUsernameTaken(
    validatedFormData.username,
    validatedFormData.username
  );

  if (nameTaken) {
    return { error: "Username taken" };
  }

  // Creating ingress
  const ingressClient = new IngressClient(
    process.env.NEXT_PUBLIC_LIVEKIT_URL!,
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
  );
  const ingressRequest = {
    name: "my-ingress",
    roomName: validatedFormData.roomId,
    participantIdentity: validatedFormData.username,
    participantName: validatedFormData.username,
    enableTranscoding: true,
  };

  const ingressData = await ingressClient.createIngress(
    IngressInput.RTMP_INPUT,
    ingressRequest
  );

  return { url: ingressData.url, password: ingressData.streamKey };
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
  const prismaRoom = await prisma.room.findFirst({
    where: { id: Number(roomId) },
  });

  if (prismaRoom?.egressId === "") {
    console.log("Creating Egress");
    const fileOutput = new EncodedFileOutput({
      filepath: `/out/videos/{room_name}-${prismaRoom?.name}.mp4`,
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

    await prisma.room.update({
      where: { id: Number(roomId) },
      data: { egressId: info.egressId },
    });
  } else {
    console.log("Stopping Egress");
    await egressClient.stopEgress(prismaRoom?.egressId!);
    await prisma.room.update({
      where: { id: Number(roomId) },
      data: { egressId: "" },
    });
  }
}

export async function getToken(input: string) {
  const tokenVerifier = new TokenVerifier(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
  );
  const token = await tokenVerifier.verify(input);
  return token;
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

  const at = new AccessToken(apiKey, apiSecret);
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
