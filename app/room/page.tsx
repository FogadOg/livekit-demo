"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import RoomView from "./components/room/roomView";
import RoomAccessForm from "./components/room/roomAccessForm";
import {
  tokenFromPermissionToken,
  validatePermissionToken,
} from "../actions/roomActions";

export default function Page() {
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState("");
  const [token, setToken] = useState("");

  const permissionsToken = searchParams.get("permissionsToken");
  const adminToken = searchParams.get("adminToken");

  const [roomExists, setRoomExists] = useState<boolean>(true);

  const [userId, setUserId] = useState("");
  const [accessRoom, setAccessRoom] = useState(false);

  useEffect(() => {
    const getRoom = async () => {
      let { room, valid } = await validatePermissionToken(permissionsToken!);
      if (valid) {
        setRoomId(room!);
      } else {
        setRoomExists(false);
      }
    };
    getRoom();
  }, [permissionsToken]);

  useEffect(() => {
    const newToken = async () => {
      if (token === "") {
        let newToken = await tokenFromPermissionToken(
          permissionsToken!,
          userId
        );
        if (newToken) {
          setToken(newToken);
        }
      }
    };
    if (accessRoom) {
      newToken();
    }
  }, [accessRoom]);

  console.log(adminToken === "asf");
  // For testing
  if (adminToken === "asf") {
    return (
      <>
        <title>{roomId ? `Livekit Room - ${roomId}` : "Livekit Room"}</title>
        <RoomView roomId={"4"} userId={"admin"} />
      </>
    );
  }
  if (accessRoom || token !== "") {
    return (
      <>
        <title>{roomId ? `Livekit Room - ${roomId}` : "Livekit Room"}</title>
        {/* <RoomView roomId={roomId!} userId={userId} /> */}
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
