// Deprecated
import {
  AccessToken,
  TrackSource,
  trackSourceToString,
} from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");
  if (!room) {
    return NextResponse.json(
      { error: 'Missing "room" query parameter' },
      { status: 400 }
    );
  } else if (!username) {
    return NextResponse.json(
      { error: 'Missing "username" query parameter' },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const canUseCamera = req.nextUrl.searchParams.get("canUseCamera") !== "false"; // Defaults to true
  const canUseMicrophone =
    req.nextUrl.searchParams.get("canUseMicrophone") !== "false"; // Defaults to true
  const canScreenShare =
    req.nextUrl.searchParams.get("canScreenShare") !== "false"; // Defaults to true

  const canPublishData =
    req.nextUrl.searchParams.get("canPublishData") !== "false"; // Defaults to true
  const hidden = req.nextUrl.searchParams.get("hidden") === "true"; // Defaults to false
  const isAdmin = req.nextUrl.searchParams.get("isAdmin") === "true"; // Defaults to false

  const at = new AccessToken(apiKey, apiSecret, { identity: username });

  let publishSources = [
    TrackSource.CAMERA,
    TrackSource.MICROPHONE,
    TrackSource.SCREEN_SHARE,
    TrackSource.SCREEN_SHARE_AUDIO,
  ];

  if (!canUseCamera) {
    publishSources = publishSources.filter(
      (type) => type !== TrackSource.CAMERA
    );
  }
  if (!canUseMicrophone) {
    publishSources = publishSources.filter(
      (type) => type !== TrackSource.MICROPHONE
    );
  }
  if (!canScreenShare) {
    publishSources = publishSources.filter(
      (type) => type !== TrackSource.SCREEN_SHARE
    );
    publishSources = publishSources.filter(
      (type) => type !== TrackSource.SCREEN_SHARE_AUDIO
    );
  }

  at.addGrant({
    room,
    roomAdmin: true,
    roomJoin: true,
    canSubscribe: true, // Can see

    hidden: hidden,
    canPublishData: canPublishData, // Messages
    // canPublish: canPublish, //Overridden by canPublishSources
    canPublishSources: publishSources,
  });

  return NextResponse.json({ token: await at.toJwt() });
}
