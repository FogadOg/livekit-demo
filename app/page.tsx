import prisma from "../lib/prisma";
import CreateRoom from "./room/createRoom";
import JoinRoomButton from "./room/joinRoomButton";
import { RoomServiceClient, Room } from "livekit-server-sdk";

export default async function Home() {
  const publicRooms = await prisma.room.findMany({ where: { public: true } });

  let roomService = new RoomServiceClient(
    process.env.NEXT_PUBLIC_LIVEKIT_URL!,
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
  );
  const rooms = await roomService.listRooms();

  return (
    <main className="p-5">
      <h1 className="text-2xl font-bold">Public rooms</h1>
      <ul>
        {publicRooms.map((room) => {
          return (
            <li key={room.id}>
              <JoinRoomButton room={room} /> |{" "}
              {rooms.find((liveRoom) => liveRoom.name == room.id.toString())
                ?.numParticipants || 0}
            </li>
          );
        })}
      </ul>

      <div className="mt-5"></div>

      <CreateRoom />
    </main>
  );
}
