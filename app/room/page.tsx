"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import RoomView from "./components/room/roomView";
import RoomAccessForm from "./components/room/roomAccessForm";

export default function Page() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [userId, setUserId] = useState("");
  const [accessRoom, setAccessRoom] = useState(false);

  if (accessRoom) {
    return <RoomView roomId={roomId!} userId={userId} />;
  }

  return (
    <RoomAccessForm
      roomId={roomId!}
      setAccessRoom={setAccessRoom}
      userId={userId}
      setUserId={setUserId}
    />
  );
}
