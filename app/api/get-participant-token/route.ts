import { AccessToken, TrackSource } from "livekit-server-sdk";
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

  const canPublish = req.nextUrl.searchParams.get("canPublish") !== "false"; // Defaults to true
  const canPublishData =
    req.nextUrl.searchParams.get("canPublishData") !== "false"; // Defaults to true
  const hidden = req.nextUrl.searchParams.get("hidden") === "true"; // Defaults to false

  console.log(canPublish, "canPublish");
  console.log(canPublishData, "canPublishData");
  console.log(hidden, "hidden");

  const at = new AccessToken(apiKey, apiSecret, { identity: username });

  at.addGrant({
    room,
    roomJoin: true,
    canSubscribe: true, // Can see

    hidden: hidden,
    canPublishData: canPublishData, // Messages
    canPublish: canPublish, //Overridden by canPublishSources
    // canPublishSources: [
    //   TrackSource.CAMERA,
    //   TrackSource.MICROPHONE,
    //   TrackSource.SCREEN_SHARE,
    //   TrackSource.SCREEN_SHARE_AUDIO,
    // ],
  });

  return NextResponse.json({ token: await at.toJwt() });
}
