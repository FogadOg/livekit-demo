"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface JoinPrivateRoomProps {
  privateRoomIds: String[];
}

const JoinPrivateRoom = ({ privateRoomIds }: JoinPrivateRoomProps) => {
  const router = useRouter();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {

    const roomId: string | null = window.prompt("room id") as string | null || "default name";

    if (privateRoomIds.includes(roomId)) {
      router.push(`/room?roomId=${roomId}`);
    } else {
      alert("Room doesn't exist");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Join private room</h1>
        <div>
          <button onClick={handleSubmit} className="btn btn-primary">
            Join private room
          </button>
        </div>
    </div>
  );
};

export default JoinPrivateRoom;
