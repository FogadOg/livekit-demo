import { deleteRoom } from "@/app/actions/adminActions";
import { Room } from "livekit-server-sdk";
import { Dispatch, SetStateAction } from "react";
import RoomIngress from "./roomIngress";

export default function AdminsRoom({
  room,
  setRooms,
}: {
  room: Room;
  setRooms: Dispatch<SetStateAction<Set<Room>>>;
}) {
  const adminToken = localStorage.getItem("room-" + room.name);
  const roomUrl = "/room?adminToken=" + adminToken;
  return (
    <div key={room.name}>
      <h2>Room id {room.name}</h2>

      <div className="flex gap-2">
        <a href={roomUrl} role="button" className="btn btn-primary">
          Join
        </a>
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
      </div>

      <RoomIngress room={room} adminToken={adminToken!} />
      <p>Room participants: {room.numParticipants}</p>
    </div>
  );
}
