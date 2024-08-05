"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import RoomView from "./components/room/roomView";
import RoomAccessForm from "./components/room/roomAccessForm";
import Head from "next/head";
import { verifyToken } from "../actions/verifyToken";

async function isRoomAdmin(adminRoomToken: string): Promise<boolean> {
  try {
    const permissions = await verifyToken(adminRoomToken);
    return permissions.token?.video?.roomCreate || false;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
}

export default function Page() {
  const [isAdmin, setIsAdmin] = useState(false)
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const adminRoomToken = searchParams.get("token");

  useEffect(() => {
    if (adminRoomToken != null) {
      isRoomAdmin(adminRoomToken).then((isAdmin) => {
        setIsAdmin(isAdmin);
      });
    }
  }, [adminRoomToken]);


  const [userId, setUserId] = useState("");
  const [accessRoom, setAccessRoom] = useState(false);
  if (accessRoom) {
    return (
      <>
        <title>{roomId ? `Livekit Room - ${roomId}` : "Livekit Room"}</title>
        <RoomView roomId={roomId!} userId={userId} isAdmin={isAdmin}/>
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
