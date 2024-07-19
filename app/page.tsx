import prisma from "../lib/prisma";
import CreateRoom from "./room/createRoom";
import JoinRoomButton from "./room/joinRoomButton";

export default async function Home() {
  const publicRooms = await prisma.room.findMany({ where: { public: true } });
  async function create(formData: FormData) {
    "use server";

    const rawFormData = {
      roomName: formData.get("roomName"),
      public: formData.get("public"),
    };
    console.log(formData);
  }

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

      <div className="mt-5"></div>

      <CreateRoom create={create} />
    </main>
  );
}
