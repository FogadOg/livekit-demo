"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import RoomView from "./roomView";
import RoomAccesForm from "./roomAccesForm";

export default function Page() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const token = searchParams.get("token");
  const tokenProvided = (token as string | null) !== null && token !== "";

  const [userId, setUserId] = useState("");
  const [accesRoom, setAccessRoom] = useState(false); //Access to room?

  if (accesRoom || tokenProvided) {
    return (
      <RoomView
        roomId={roomId!}
        userId={userId}
        providedToken={token !== null ? token : undefined}
      />
    );
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
