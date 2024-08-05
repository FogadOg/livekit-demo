"use server";

import { TokenVerifier } from "livekit-server-sdk";


export async function verifyToken(permissionToken: string) {
    const tokenVerifier = new TokenVerifier(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!
    );
    try {
      const token = await tokenVerifier.verify(permissionToken);
      if (!token) {
        console.error("token not valid!");
        return { valid: false };
      }
      console.log("------- token: ",token);
      
      return { room: token.video?.room, token: token, valid: true };
    } catch {
      console.error("token not valid!");
      return { valid: false };
    }
  }
