import { NextResponse } from "next/server";
import {
  RoomCompositeEgressRequest,
  WebhookReceiver,
} from "livekit-server-sdk";

// Replace these with your actual API key and secret
const receiver = new WebhookReceiver("webhook_key", "webhook_secret");

export async function POST(req: Request) {
  try {
    const rawBody = await req.text(); // Extract raw body text
    const authHeader = req.headers.get("Authorization") || "";

    // Receive and validate the event
    const event = await receiver.receive(rawBody, authHeader);

    // Process the event based on its type
    switch (event.event) {
      // case "room_started":
      // console.log("Room started");
      // break;
      case "egress_ended":
        if (
          event.egressInfo &&
          (event.egressInfo.request.value as RoomCompositeEgressRequest)
            .audioOnly
        )
          console.log("Room finished, tell Swiftner");
        break;
      // Add cases for other events as needed
      default:
        console.log("Unhandled webhook event type:", event.event);
    }

    // Respond with a success status
    return NextResponse.json({ message: "Event processed" });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return NextResponse.json({ message: "Invalid event" }, { status: 400 });
  }
}
