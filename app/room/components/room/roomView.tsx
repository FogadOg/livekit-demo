"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutContextProvider,
  Chat,
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";

import { CustomControlBar } from "../../../components/customControlBar";
import { deleteRoomIfEmpty } from "../../../actions/roomActions";
import { VideoConference } from "../../videoConference";



interface RoomProps {
  roomId: string;
  userId: string;
}

const RoomView = ({ roomId, userId }: RoomProps) => {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  console.log("userId: ",userId);
  
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `/api/get-participant-token?room=${roomId}&username=${userId}`
        );

        if (!response.ok) {
          console.error(`Error fetching token: ${response.statusText}`);
          return;
        }

        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    const handleUnload = () => {
      deleteRoomIfEmpty(roomId);
    };

    window.addEventListener("unload", handleUnload);

    fetchToken();

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, [roomId, userId]);

  if (!token) {
    return <div>Getting token...</div>;
  }

  return (
    <div className="overflow-hidden">
      <LayoutContextProvider>
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          style={{ height: "100dvh" }}
          onDisconnected={() => {
            deleteRoomIfEmpty(roomId);
            router.replace("/");
          }}
        >
          <div className="flex">
            <VideoConference userName={userId}/>
            <Chat />
          </div>
          <RoomAudioRenderer />
          <CustomControlBar />
        </LiveKitRoom>
      </LayoutContextProvider>

    </div>
  );
};

export default RoomView;
