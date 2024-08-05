"use server";

import { TokenVerifier } from "livekit-server-sdk";


export async function verifyToken(permissionToken: string) {
    const tokenVerifier = new TokenVerifier(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!
    );
    try {
      const permissions = await tokenVerifier.verify(permissionToken);
      if (!permissions) {
        console.error("token not valid!");
        return { valid: false };
      }
      
      return { roomAdmin: permissions.video?.roomAdmin, roomCreate: permissions.roomCreate, room: permissions.video?.room, token: permissions, valid: true };
    } catch {
      console.error("token not valid!");
      return { valid: false };
    }
  }
