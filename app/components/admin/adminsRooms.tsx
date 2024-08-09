import { filterActiveRooms } from "@/app/actions/adminActions";
import { Room } from "livekit-server-sdk";
import { useEffect, useState } from "react";
import AdminsRoom from "./adminsRoom";

export default function AdminsRooms() {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Set<Room>>(new Set());
  const keys = Object.keys(localStorage);

  const roomNames = keys
    .filter((key) => key.startsWith("room-"))
    .map((room) => room.replace("room-", ""));

  useEffect(() => {
    const getRooms = async () => {
      const newRooms = await filterActiveRooms(roomNames);
      setRooms(new Set([...newRooms]));

      setLoading(false);
    };
    getRooms();
  }, []);

  return (
    <>
      <h2>Your active rooms:</h2>
      {loading && (
        <span className="loading loading-spinner loading-lg m-auto block"></span>
      )}

      {rooms.size === 0 && !loading && <p>No active rooms</p>}
      {Array.from(rooms).map((room) => (
        <AdminsRoom room={room} setRooms={setRooms} key={room.name} />
      ))}
    </>
  );
}
