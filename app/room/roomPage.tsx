"use client";

import RoomView from "./components/room/roomView";
import PreJoinRoom from "./components/room/preJoinRoom";
import useToken from "../hooks/useToken";
import { useState } from "react";
import { LocalUserChoices } from "@livekit/components-react";

export default function RoomPage() {
  const [preJoinChoices, setPreJoinChoices] =  useState<LocalUserChoices | undefined>(undefined)

  const { token, setToken, permissionsToken } = useToken();
  if (token !== "") {
    return <RoomView token={token} preJoinChoices={preJoinChoices}/>;
  }
  if (!permissionsToken) {
    return (
      <>
        <h1 className="font-bold text-xl">No token?</h1>
        <p>You are missing token from url? Please make sure to copy full url</p>
      </>
    );
  }

  return <PreJoinRoom setToken={setToken} permissionToken={permissionsToken} setPreJoinChoices={setPreJoinChoices}/>;
}
