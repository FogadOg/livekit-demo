import prisma from "../lib/prisma";
import CreateRoom from "./room/createRoom";
import JoinRoomButton from "./room/joinRoomButton";
import { RoomServiceClient, Room } from "livekit-server-sdk";

export default async function Home() {
  const publicRooms = await prisma.room.findMany({ where: { public: true } });

  async function create(formData: FormData) {
    "use server";

    const validatedFormData = {
      name: (formData.get("roomName") as string | null) || "default room",
      public: (formData.get("public") || "off") === "on",
    };

    const newRoom = await prisma.room.create({
      data: validatedFormData,
    });
    return `/room?roomId=${newRoom.id}&username=Creator`;
  }

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

      <CreateRoom create={create} />
    </main>
  );
}
