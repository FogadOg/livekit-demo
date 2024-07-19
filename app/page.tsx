import prisma from "../lib/prisma";

export default async function Home() {
  const publicRooms = await prisma.room.findMany({ where: { public: true } });

  return (
    <>
      <h1>Public rooms</h1>
      <ul>
        {publicRooms.map((room) => {
          return (
            <li>
              <a href={"/room?roomId=" + room.id} className="underline">
                {room.name}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
