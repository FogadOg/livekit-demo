import prisma from "../lib/prisma";
import JoinRoomButton from "./room/joinRoomButton";

export default async function Home() {
  const publicRooms = await prisma.room.findMany({ where: { public: true } });
  return (
    <main className="p-5">
      <h1 className="text-2xl font-bold">Public rooms</h1>
      <ul>
        {publicRooms.map((room) => {
          return (
            <li>
              - <JoinRoomButton room={room} />
            </li>
          );
        })}
      </ul>
    </main>
  );
}
