"use client";
import { Room } from "@prisma/client";
import { useRouter } from "next/navigation";

interface JoinPublicRoomProps {
  room: Room;
  participantsCount: number;
}

const JoinPublicRoom = ({ room, participantsCount }: JoinPublicRoomProps) => {
  const router = useRouter();

  const handleClick = async () => {
    router.push(`/room?roomId=${room.id}`);
  };

  return (
    <div key={room.id} className="border w-64 p-5 rounded border-gray-300">
      <h2 className="text-xl font-medium">{room.name}</h2>
      <p>Particpents count: {participantsCount}</p>

      <button onClick={handleClick} className="btn btn-primary">
        Join
      </button>
    </div>
  );
};

export default JoinPublicRoom;
