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

  const [roomExists, setRoomExists] = useState<boolean>(true);

  useEffect(() => {
    const getRoom = async () => {
      let room = await validatePermissionToken(permissionsToken!);
      if (room) {
        setRoomId(room);
      } else {
        setRoomExists(false);
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

  if (!roomExists) {
    return (
      <>
        <h1 className="font-bold text-xl">Sorry, couldn't find the room</h1>
        <p>Couldn't find the room you are looking for</p>
      </>
    );
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
