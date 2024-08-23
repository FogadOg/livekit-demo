"use client";

import { validatedRoomPasswordAndUsername } from "@/app/actions/userActions";
import "@livekit/components-styles";
import useRoomState from "@/app/hooks/useRoomState";
import { LocalUserChoices, PreJoin } from "@livekit/components-react";
import { Dispatch, SetStateAction, useState } from "react";

interface RoomAccessProps {
  setToken: (token: string) => void;
  permissionToken: string;
  setPreJoinChoices:   Dispatch<SetStateAction<LocalUserChoices | undefined>>  ;
}

const RoomAccess = ({ setToken, permissionToken, setPreJoinChoices }: RoomAccessProps) => {
  const { expired, roomExists, roomId } = useRoomState({
    permissionToken,
    setToken,
  });

  const submitUsername = async (userId: string) => {
    let { message, token } = await validatedRoomPasswordAndUsername(
      roomId,
      userId,
      permissionToken
    );
    if (token) {
      setToken(token);
    } else if (message !== "") {
      alert(message);
    } else {
      window.location.reload();
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
        <h1 className="font-bold text-xl">
          Sorry, couldn&apos;t find the room
        </h1>
        <p>Couldn&apos;t find the room you are looking for</p>
      </>
    );
  }

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
    <div className="flex items-center justify-center h-screen">
      <PreJoin
        onSubmit={(options) => {
          submitUsername(options.username);
          setPreJoinChoices(options)
        }}
        defaults={{
          username: "",
          videoEnabled: true,
          audioEnabled: true,
        }}
        onError={(error) => {
          console.error('Error during pre-join:', error);
        }}
      />

    </div>
  );
};

export default RoomAccess;
