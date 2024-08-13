import { RoomServiceClient, Room } from "livekit-server-sdk";

let roomService: RoomServiceClient;

if (process.env.NODE_ENV === "production") {
  roomService = new RoomServiceClient(
    process.env.NEXT_PUBLIC_LIVEKIT_URL!,
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
  );
} else {
  if (!global.roomService) {
    global.roomService = new RoomServiceClient(
      process.env.NEXT_PUBLIC_LIVEKIT_URL!,
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET
    );
  }
  roomService = global.roomService;
}

export default roomService;
