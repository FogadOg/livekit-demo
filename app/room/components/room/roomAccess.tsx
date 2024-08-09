"use client";

import { validateToken } from "@/app/actions/roomActions";
import {
  getRoomState,
  validatedRoomPasswordAndUsername,
} from "@/app/actions/userActions";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import React from "react";
import RoomAccessForm from "./roomAccessForm";

interface RoomProps {
  setToken: (token: string) => void;
  permissionToken: string;
}

const RoomAccess = ({ setToken, permissionToken }: RoomProps) => {
  const [isRoomPublic, setIsRoomPublic] = useState<boolean>(true);

  const [roomExists, setRoomExists] = useState<boolean>(true);
  const [expired, setExpired] = useState<boolean>(false);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const fetchRoomState = async () => {
      const { valid, room, expired } = await validateToken(permissionToken);
      if (!valid) {
        setExpired(expired!);
        setRoomExists(false);
        setRoomId(room!);
        return;
      }

      setRoomId(room!);
      const roomState = await getRoomState(room!);
      if (roomState.valid) {
        setIsRoomPublic(roomState.roomPublic!);
      } else {
        setRoomExists(false);
      }
    };

    fetchRoomState();
  }, [permissionToken, roomId]);

  const submitUsernameAndPassword = async (
    userId: string,
    password: string
  ) => {
    let { message, token } = await validatedRoomPasswordAndUsername(
      roomId,
      userId,
      password,
      permissionToken
    );
    if (token) {
      setToken(token);
      localStorage.setItem("room-" + roomId.toString(), token);
    }
    if (message !== "") {
      alert(message);
    }
  };

  if (expired) {
    return (
      <>
        <h1 className="font-bold text-xl">Looks like the link has expired</h1>
        <p>Ask the admin of the site to send a new link</p>
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

  // Loading
  if (roomId === "") {
    return (
      <div className="flex flex-col gap-2 m-5">
        <div className="skeleton h-[48px] w-[250px]"></div>
        <div className="skeleton h-[48px] w-[250px]"></div>
        <div className="skeleton h-[48px] w-[62px]"></div>
      </div>
    );
  }
  return (
    <RoomAccessForm
      submitUsernameAndPassword={submitUsernameAndPassword}
      isRoomPublic={isRoomPublic}
    />
  );
};

export default RoomAccess;
