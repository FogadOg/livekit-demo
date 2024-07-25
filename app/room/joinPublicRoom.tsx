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
    <div key={room.id} className="card bg-base-100 w-64 shadow-md border ">
      <div className="card-body">
        <h2 className="card-title">{room.name}</h2>
        <p>Particpents count: {participantsCount}</p>
        <div className="card-actions justify-end">
          <button onClick={handleClick} className="btn btn-primary">
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinPublicRoom;
