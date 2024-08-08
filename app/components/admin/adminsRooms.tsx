import {
  deleteRoom,
  filterActiveRooms,
  createIngress,
} from "@/app/actions/adminActions";
import { Room } from "livekit-server-sdk";
import { FormEvent, useEffect, useState } from "react";

export default function AdminsRooms() {
  const [message, setMessage] = useState("Getting rooms...");
  const [rooms, setRooms] = useState<Set<Room>>(new Set());
  const keys = Object.keys(localStorage);

  const roomItems = keys
    .filter((key) => key.startsWith("room-"))
    .map((room) => room.replace("room-", ""));

  useEffect(() => {
    const getRooms = async () => {
      const newRooms = await filterActiveRooms(roomItems);
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
                      return newRooms;
                    });
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
      })}
    </>
  );
}

function RoomIngress({ room, adminToken }: { room: Room; adminToken: string }) {
  const [username, setUsername] = useState("");
  const [ingressUrl, setIngressUrl] = useState("");
  const [ingressPassword, setIngressPassword] = useState("");

  const startIngress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { valid, url, password } = await createIngress(
      adminToken,
      room,
      username
    );
    if (valid) {
      setIngressUrl(url!);
      setIngressPassword(password!);
    }
  };
  return (
    <form onSubmit={startIngress}>
      <input
        id="username"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered"
        required
      />
      <input
        type="submit"
        className="btn btn-primary"
        value={"Start ingress"}
      />
      {ingressUrl !== "" && <p>Ingress url: {ingressUrl}</p>}
      {ingressPassword !== "" && <p>Ingres password: {ingressPassword}</p>}
    </form>
  );
}
