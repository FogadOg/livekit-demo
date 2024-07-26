"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface JoinPrivateRoomProps {
  privateRoomIds: String[];
}

const JoinPrivateRoom = ({ privateRoomIds }: JoinPrivateRoomProps) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // don't refresh
    const formData = new FormData(event.currentTarget);

    let roomId = (formData.get("roomId") as string | null) || "default name";

    setError("");
    if (privateRoomIds.includes(roomId)) {
      router.push(`/room?roomId=${roomId}`);
    } else {
      setError("Room doesn't exist");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Join private room</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div>
          <input
            type="text"
            name="roomId"
            id="roomId"
            placeholder="Room id"
            className="input input-bordered"
            required
          />
        </div>
        <div>
          <input type="submit" value="Join" className="btn btn-primary" />
        </div>
        <p className="text-red-500">{error}</p>
      </form>
    </div>
  );
};

export default JoinPrivateRoom;
