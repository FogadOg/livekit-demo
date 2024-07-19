import prisma from "../lib/prisma";
import JoinRoomButton from "./room/joinRoomButton";

export default async function Home() {
  const publicRooms = await prisma.room.findMany({ where: { public: true } });
  return (
    <>
      <h1>Public rooms</h1>
      <ul>
        {publicRooms.map((room) => {
          return (
            <li>
              <JoinRoomButton room={room} />
            </li>
          );
        })}
      </ul>
    </>
  );
}
