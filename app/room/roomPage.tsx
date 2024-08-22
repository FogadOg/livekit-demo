"use client";

import RoomView from "./components/room/roomView";
import RoomAccess from "./components/room/roomAccess";
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

  return <RoomAccess setToken={setToken} permissionToken={permissionsToken} setPreJoinChoices={setPreJoinChoices}/>;
}
