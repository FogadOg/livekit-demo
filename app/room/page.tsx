"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import RoomView from "./components/room/roomView";
import RoomAccessForm from "./components/room/roomAccessForm";

import { validateToken } from "../actions/roomActions";

export default function Page() {
  const searchParams = useSearchParams();

  const permissionsToken = searchParams.get("permissionsToken");
  const adminToken = searchParams.get("adminToken");

  const [roomId, setRoomId] = useState("");
  const [token, setToken] = useState(adminToken ? adminToken : "");

  const [roomExists, setRoomExists] = useState<boolean>(true);

  useEffect(() => {
    const getRoom = async (token: string) => {
      let { room, valid } = await validateToken(token);
      if (valid) {
        setRoomId(room!);
      } else {
        setRoomExists(false);
      }
    };
    if (permissionsToken !== null) {
      getRoom(permissionsToken);
    } else {
      setRoomExists(false);
    }
  }, [permissionsToken]);

  if (token !== "") {
    return (
      <>
        <title>{roomId ? `Livekit Room - ${roomId}` : "Livekit Room"}</title>
        <RoomView token={token} />
      </>
    );
  }
  if (!permissionsToken) {
    return (
      <>
        <h1 className="font-bold text-xl">No token?</h1>
        <p>You are missing token from url? Please make sure to copy full url</p>
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
        setToken={setToken}
        permissionToken={permissionsToken}
      />
    </>
  );
}
