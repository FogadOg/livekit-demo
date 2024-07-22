import prisma from "@/lib/prisma";
import roomService from "@/lib/roomService";

import CreateRoom from "./room/createRoom";
import JoinRoomButton from "./room/joinRoomButton";
import JoinPrivateRoom from "./room/joinPrivateRoom";

export default async function Home() {
  const publicRooms = await prisma.room.findMany({ where: { public: true } });
  const rooms = await roomService.listRooms();

  return (
    <main className="p-5">
      <h1 className="text-2xl font-bold">Public rooms</h1>
      <section className="flex flex-wrap gap-2">
        {publicRooms.map((room) => {
          return (
            <div
              key={room.id}
              className="border w-64 p-5 rounded border-gray-300"
            >
              <h2 className="text-xl font-medium">{room.name}</h2>
              <p>
                Particpents count:{" "}
                {rooms.find((liveRoom) => liveRoom.name == room.id.toString())
                  ?.numParticipants || 0}
              </p>
              <JoinRoomButton room={room} />
            </div>
          );
        })}
      </section>

      <div className="mt-5"></div>

      <JoinPrivateRoom />
      <CreateRoom />
    </main>
  );
}
