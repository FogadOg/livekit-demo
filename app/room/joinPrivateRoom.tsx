"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";

interface JoinPrivateRoomProps {
  privateRoomIds: String[];
}

const JoinPrivateRoom = ({ privateRoomIds }: JoinPrivateRoomProps) => {
  const router = useRouter();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // don't refresh
    const formData = new FormData(event.currentTarget);

    let roomId = (formData.get("roomId") as string | null) || "default name";

    if (privateRoomIds.includes(roomId)) {
      router.push(`/room?roomId=${roomId}&username=Hello World`);
    } else {
      console.log("Room doesn't exist");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Join private room</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div>
          <label htmlFor="roomId">Room id:</label>
          <input
            type="text"
            name="roomId"
            id="roomId"
            className="border-black border-2 rounded"
          />
        </div>
        <div>
          <input
            type="submit"
            value="Join"
            className="bg-gray-300 hover:bg-gray-400 cursor-pointer rounded px-2 py-1"
          />
        </div>
      </form>
    </div>
  );
};

export default JoinPrivateRoom;
