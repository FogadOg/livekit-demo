import { getAdminsRooms } from "@/app/actions/adminActions";
import { Room } from "livekit-server-sdk";
import { useEffect, useState } from "react";

export default function AdminsRooms() {
  const [message, setMessage] = useState("Getting rooms...");
  const [rooms, setRooms] = useState<Room[]>([]);
  const keys = Object.keys(localStorage);

  const roomItems = keys
    .filter((key) => key.startsWith("room-"))
    .map((room) => room.replace("room-", ""));

  useEffect(() => {
    const getRooms = async () => {
      setRooms(await getAdminsRooms(roomItems));

      setMessage("");
    };
    getRooms();
  }, []);

  return (
    <>
      <h2>Your active rooms:</h2>
      {message !== "" && <p>{message}</p>}
      {rooms.length === 0 && message === "" && <p>No active rooms</p>}
      {rooms.map((room) => {
        const adminToken = localStorage.getItem("room-" + room.name);
        const roomUrl = "/room?adminToken=" + adminToken;

        return (
          <div key={room.name}>
            <h2>Room id {room.name}</h2>

            <div className="flex gap-2">
              <a href={roomUrl} role="button" className="btn btn-primary">
                Join
              </a>
              <button className="btn btn-error">Delete room</button>
            </div>
            <p>Room participants: {room.numParticipants}</p>
          </div>
        );
      })}
    </>
  );
}
