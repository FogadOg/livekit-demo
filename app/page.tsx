import prisma from "@/lib/prisma";
import roomService from "@/lib/roomService";

import CreateRoom from "./room/components/room/createRoom";
import CreateIngress from "./room/createIngress";
import { Navbar } from "./components/navbar";
import { deleteRoomIfEmpty } from "./actions/roomActions";

export const metadata = {
  title: "Livekit demo",
  description: "Page description",
};

export default async function Home() {
  let rooms = await prisma.room.findMany();

  const liveRooms = await roomService.listRooms();
  const liveRoomIds = liveRooms.map((room) => room.name);

  // This is bad, should be handled by livekit webhooks
  for (let room of rooms) {
    if (!liveRoomIds.includes(room.id.toString())) {
      rooms = rooms.filter((r) => r.id !== room.id);
      deleteRoomIfEmpty(room.id.toString());
    }
  }

  return (
    <>
      <Navbar />
      <main className="px-16 py-5 flex">
        <div className="flex-1 grid justify-center items-center gap-10">
          <div className="mt-5 flex gap-4">
            <CreateRoom />
            <CreateIngress />
          </div>
        </div>
      </main>
    </>
  );
}
