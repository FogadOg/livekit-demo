"use client";

import { useRouter } from "next/navigation";

interface JoinPrivateRoomProps {
  privateRoomIds: string[];
}

const JoinPrivateRoom = ({ privateRoomIds }: JoinPrivateRoomProps) => {
  const router = useRouter();

  const handleClick = () => {
    const roomId: string = window.prompt("Enter room id") || "default name";

    if (privateRoomIds.includes(roomId)) {
      router.push(`/room?roomId=${roomId}`);
    } else {
      alert("Room doesn't exist");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <button onClick={handleClick} className="btn btn-primary w-full">
        Join private room
      </button>
    </div>
  );
};

export default JoinPrivateRoom;
