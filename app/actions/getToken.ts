import {
    AccessToken,
    TrackSource,
    trackSourceToString,
  } from "livekit-server-sdk";
  import { NextRequest, NextResponse } from "next/server";
  
  export async function getToken() {
  
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  
    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }
  
    const at = new AccessToken(apiKey, apiSecret, { identity: "username" });
  
    let publishSources = [
      TrackSource.CAMERA,
      TrackSource.MICROPHONE,
      TrackSource.SCREEN_SHARE,
      TrackSource.SCREEN_SHARE_AUDIO,
    ];
  
  
    at.addGrant({
      roomCreate: true,
      roomJoin: true,
      canSubscribe: true,
      canPublishSources: publishSources,
    });
  
    return NextResponse.json({ token: await at.toJwt() });
  }
  