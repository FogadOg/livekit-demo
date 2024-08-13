import { IngressClient } from "livekit-server-sdk";

const ingressClient = new IngressClient(
  process.env.NEXT_PUBLIC_LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export default ingressClient;
