"use client";

import { validatedRoomPasswordAndUsername } from "@/app/actions/userActions";
import "@livekit/components-styles";
import RoomAccessForm from "./roomAccessForm";
import useRoomState from "@/app/hooks/useRoomState";

interface RoomAccessProps {
  setToken: (token: string) => void;
  permissionToken: string;
}

const RoomAccess = ({ setToken, permissionToken }: RoomAccessProps) => {
  const { expired, isRoomPublic, roomExists, roomId } = useRoomState({
    permissionToken,
    setToken,
  });

  const submitUsername = async (
    userId: string,
  ) => {
    let { message, token } = await validatedRoomPasswordAndUsername(
      roomId,
      userId,
      permissionToken
    );
    if (token) {
      setToken(token);
      // localStorage.setItem("room-" + roomId.toString(), token);
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
      submitUsername={submitUsername}
      isRoomPublic={isRoomPublic}
    />
  );
};

export default RoomAccess;
