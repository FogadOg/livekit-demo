import Image from "next/image";
import prisma from "../lib/prisma";

export default async function Home() {
  const publicRooms = await prisma.room.findMany({ where: { public: true } });

  return (
    <>
      <h1>Public rooms</h1>
      <ul>
        {publicRooms.map((room) => {
          return <li>{room.name}</li>;
        })}
      </ul>
    </>
  );
}
