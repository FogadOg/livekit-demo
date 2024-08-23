"use client";

import { validatedRoomPasswordAndUsername } from "@/app/actions/userActions";
import "@livekit/components-styles";
import useRoomState from "@/app/hooks/useRoomState";
import { LocalUserChoices, PreJoin } from "@livekit/components-react";
import { Dispatch, SetStateAction, useState } from "react";

interface PreJoinRoomProps {
  setToken: (token: string) => void;
  permissionToken: string;
  setPreJoinChoices:   Dispatch<SetStateAction<LocalUserChoices | undefined>>  ;
}

const PreJoinRoom = ({ setToken, permissionToken, setPreJoinChoices }: PreJoinRoomProps) => {
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
      <div className="flex items-center justify-center h-screen">
        <div className="grid gap-4">
          <svg className="w-12 h-12 text-gray-300 animate-spin" viewBox="0 0 64 64" fill="none"
            xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path
              d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
              stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path
              d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
              stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" className="text-gray-900">
            </path>
          </svg>
          <p>Loading</p>

        </div>
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
          if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            alert("No camera or microphone was found. Please connect a device and try again.");
          } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            alert("Permission to access camera or microphone was denied. Please allow access and try again.");
          } else {
            alert("An unexpected error occurred during pre-join. Please check your devices and try again.");
          }
        }}
      />

    </div>
  );
};

export default PreJoinRoom;
