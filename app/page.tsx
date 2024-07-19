import prisma from "@/lib/prisma";
import roomService from "@/lib/roomService";

import CreateRoom from "./room/createRoom";
import JoinRoomButton from "./room/joinRoomButton";

export default async function Home() {
  const publicRooms = await prisma.room.findMany({ where: { public: true } });
  const rooms = await roomService.listRooms();

  return (
    <main className="p-5">
      <h1 className="text-2xl font-bold">Public rooms</h1>
      <ul>
        {publicRooms.map((room) => {
          return (
            <li key={room.id}>
              <JoinRoomButton room={room} /> | Particpents count:{" "}
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
