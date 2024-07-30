"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import RoomView from "./components/room/roomView";
import RoomAccesForm from "./components/room/roomAccesForm";

export default function Page() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const token = searchParams.get("token");
  const tokenProvided = (token as string | null) !== null && token !== "";

  const [userId, setUserId] = useState("");
  const [accessRoom, setAccessRoom] = useState(false); //Access to room?

  if (accessRoom) {
    return <RoomView roomId={roomId!} userId={userId} />;
  }

  return (
    <RoomAccesForm
      roomId={roomId!}
      setAccessRoom={setAccessRoom}
      userId={userId}
      setUserId={setUserId}
    />
  );
}
