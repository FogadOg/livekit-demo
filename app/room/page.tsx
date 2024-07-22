"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import RoomView from "./roomView";
import RoomAccesForm from "./roomAccesForm";

export default function Page() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [userId, setUserId] = useState("");
  const [accesRoom, setAccessRoom] = useState(false); //Access to room?

  if (accesRoom) {
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
