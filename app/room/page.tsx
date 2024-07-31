"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import RoomView from "./components/room/roomView";
import RoomAccessForm from "./components/room/roomAccessForm";
import Head from "next/head";

export default function Page() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

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

  return (
    <>
      <title>{roomId ? `Livekit Room - ${roomId}` : "Livekit Room"}</title>
      <RoomAccessForm
        roomId={roomId!}
        setAccessRoom={setAccessRoom}
        userId={userId}
        setUserId={setUserId}
      />
    </>
  );
}
