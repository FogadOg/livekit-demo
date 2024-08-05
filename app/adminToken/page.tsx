import { AccessToken, TrackSource } from "livekit-server-sdk";

export default async function Page() {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  const at = new AccessToken(apiKey, apiSecret, { identity: "Admin" });

  at.addGrant({
    room: "1",
    roomJoin: true,
    canSubscribe: true,
    canPublish: true,
    roomAdmin: true,
    canPublishData: true,

    canPublishSources: [
      TrackSource.CAMERA,
      TrackSource.MICROPHONE,
      TrackSource.SCREEN_SHARE,
      TrackSource.SCREEN_SHARE_AUDIO,
    ],
  });

  return (
    <>
      <h1>Admin token</h1>
      <p>{await at.toJwt()}</p>
    </>
  );
}
