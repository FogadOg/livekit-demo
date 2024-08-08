import { deleteRoom, getAdminsRooms } from "@/app/actions/adminActions";
import { Room } from "livekit-server-sdk";
import { useEffect, useState } from "react";

export default function AdminsRooms() {
  const [message, setMessage] = useState("Getting rooms...");
  const [rooms, setRooms] = useState<Set<Room>>(new Set());
  const keys = Object.keys(localStorage);

  const roomItems = keys
    .filter((key) => key.startsWith("room-"))
    .map((room) => room.replace("room-", ""));

  useEffect(() => {
    const getRooms = async () => {
      const newRooms = await getAdminsRooms(roomItems);
      setRooms(new Set([...newRooms]));

      setMessage("");
    };
    getRooms();
  }, []);

  return (
    <>
      <h2>Your active rooms:</h2>
      {message !== "" && <p>{message}</p>}
      {rooms.size === 0 && message === "" && <p>No active rooms</p>}
      {Array.from(rooms).map((room) => {
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
                      return prevRooms;
                    });
                  }
                }}
              >
                Delete room
              </button>
            </div>
            <p>Room participants: {room.numParticipants}</p>
          </div>
        );
      })}
    </>
  );
}
