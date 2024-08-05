"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import RoomView from "./components/room/roomView";
import RoomAccessForm from "./components/room/roomAccessForm";
import { validatePermissionToken } from "../actions/roomActions";

export default function Page() {
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState("");
  const permissionsToken = searchParams.get("permissionsToken");

  useEffect(() => {
    const getRoom = async () => {
      let room = await validatePermissionToken(permissionsToken!);

      console.log();
      if (room) {
        setRoomId(room);
      }
    };
    getRoom();
  }, [permissionsToken]);

  const [userId, setUserId] = useState("");
  const [accessRoom, setAccessRoom] = useState(false);
  if (accessRoom) {
    return (
      <>
        <title>{roomId ? `Livekit Room - ${roomId}` : "Livekit Room"}</title>
        <RoomView roomId={roomId!} userId={userId} />
      </>
    );
  }

  if (roomId === "") {
    return <p>"Getting room"</p>;
  }
  return (
    <>
      <title>{roomId ? `Livekit Room - ${roomId}` : "Livekit Room"}</title>
      <RoomAccessForm
        roomId={roomId}
        setAccessRoom={setAccessRoom}
        userId={userId}
        setUserId={setUserId}
      />
    </>
  );
}
