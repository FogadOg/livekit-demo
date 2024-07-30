import prisma from "@/lib/prisma";
import roomService from "@/lib/roomService";

import CreateRoom from "./room/components/room/createRoom";
import JoinPublicRoom from "./room/components/room/joinPublicRoom";
import JoinPrivateRoom from "./room/components/room/joinPrivateRoom";
import CreateIngress from "./room/createIngress";
import { Navbar } from "./components/navbar";

export default async function Home() {
  let rooms = await prisma.room.findMany();

  const liveRooms = await roomService.listRooms();
  const liveRoomIds = liveRooms.map((room) => room.name);

  for (let room of rooms) {
    if (!liveRoomIds.includes(room.id.toString())) {
      rooms = rooms.filter((r) => r.id !== room.id);
      prisma.room.delete({ where: { id: room.id } });
    }
  }
  const publicRooms = rooms.filter((room) => room.public);
  const privateRooms = rooms.filter((room) => !room.public);

  return (
    <>
      <Navbar />
      <main className="px-16 py-5 flex">
        <div>
          <h1 className="text-2xl font-bold">Public rooms</h1>
          <section className="flex flex-wrap gap-4">
            {publicRooms.map((room) => {
              return (
                <JoinPublicRoom
                  room={room}
                  participantsCount={
                    liveRooms.find(
                      (liveRoom) => liveRoom.name == room.id.toString()
                    )?.numParticipants || 0
                  }
                />
              );
            })}
          </section>
        </div>
        <div>
          <JoinPrivateRoom
            privateRoomIds={privateRooms.map((room) => room.id.toString())}
          />

          <div className="mt-5 flex gap-4">
            <CreateRoom />
            <CreateIngress />
          </div>

        </div>


      </main>
    </>
  );
}
