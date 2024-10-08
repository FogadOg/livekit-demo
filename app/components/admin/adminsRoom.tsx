import { deleteRoom } from "@/app/actions/adminActions";
import { Room } from "livekit-server-sdk";
import { Dispatch, SetStateAction } from "react";
import RoomIngress from "./roomIngress";

export default function AdminsRoom({
  room,
  setRooms,
}: {
  room: { name: string; numParticipants: number };
  setRooms: Dispatch<
    SetStateAction<Set<{ name: string; numParticipants: number }>>
  >;
}) {
  const adminToken = localStorage.getItem("roomAdmin-" + room.name);
  const roomUrl = "/room?roomId=" + room.name;
  return (
    <div className="shadow-lg p-7 grid gap-5">
      <div className="flex flex-row-3 divide-x">
        <p className="px-3">Room participants: {room.numParticipants}</p>
        <h2 className="px-3">Room id: {room.name}</h2>
      </div>

      <div className="flex gap-2">
        <button
          className="btn btn-error"
          onClick={async () => {
            const deletedRoom = await deleteRoom(adminToken!, room.name);
            if (deletedRoom) {
              setRooms((prevRooms) => {
                const newRooms = new Set(prevRooms);
                newRooms.delete(room);
                return newRooms;
              });
            } else {
              window.location.reload();
            }
          }}
        >
          Delete room
        </button>
        <RoomIngress roomName={room.name} adminToken={adminToken!} />

        <a href={roomUrl} role="button" className="btn btn-primary">
          Join
        </a>
      </div>
    </div>
  );
}
