"use client";
import { Room } from "@prisma/client";
import { useRouter } from "next/navigation";

interface JoinPublicRoomProps {
  room: Room;
  adminRoomToken: string;
  participantsCount: number;
}

const JoinPublicRoom = ({ room, participantsCount }: JoinPublicRoomProps) => {
  const router = useRouter();

  const handleClick = async () => {
    router.push(`/room?roomId=${room.id}`);
  };

  return (
    <div key={room.id} className="card bg-base-100 w-64 shadow-2xl rounded-3xl">
      <div className="card-body">
        <h2 className="card-title">{room.name}</h2>
        <p>Participants count: {participantsCount}</p>
        <div className="card-actions justify-end">
          <button onClick={handleClick} className="btn btn-primary rounded-xl">
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinPublicRoom;
