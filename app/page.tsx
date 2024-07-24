import prisma from "@/lib/prisma";
import roomService from "@/lib/roomService";

import CreateRoom from "./room/createRoom";
import JoinPublicRoom from "./room/joinPublicRoom";
import JoinPrivateRoom from "./room/joinPrivateRoom";
import CreateIngress from "./room/createIngress";

export default async function Home() {
  const publicRooms = await prisma.room.findMany({ where: { public: true } });
  const privateRooms = await prisma.room.findMany({ where: { public: false } });
  const rooms = await roomService.listRooms();

  return (
    <main className="p-5">
      <h1 className="text-2xl font-bold">Public rooms</h1>
      <section className="flex flex-wrap gap-2">
        {publicRooms.map((room) => {
          return (
            <JoinPublicRoom
              room={room}
              participantsCount={
                rooms.find((liveRoom) => liveRoom.name == room.id.toString())
                  ?.numParticipants || 0
              }
            />
          );
        })}
      </section>

      <div className="mt-5"></div>

      <JoinPrivateRoom
        privateRoomIds={privateRooms.map((room) => room.id.toString())}
      />

      <div className="mt-5"></div>
      <CreateRoom />

      <div className="mt-5"></div>

      <CreateIngress />
    </main>
  );
}
