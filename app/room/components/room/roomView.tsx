"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutContextProvider,
  Chat,
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipantPermissions,
  useRoomInfo,
} from "@livekit/components-react";
import "@livekit/components-styles";

import { CustomControlBar } from "../../../components/customControlBar";
import { VideoConference } from "../../videoConference";
import { deleteRoomIfEmpty } from "@/app/actions/roomActions";
interface RoomProps {
  token: string;
}

const RoomView = ({ token }: RoomProps) => {
  const router = useRouter();
  const roomId = useRoomInfo().name;
  useEffect(() => {
    const handleUnload = () => {
      deleteRoomIfEmpty(roomId);
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

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
            <VideoConference />
            <CustomChat />
          </div>
          <RoomAudioRenderer />
          <CustomControlBar token={token} />
        </LiveKitRoom>
      </LayoutContextProvider>
    </div>
  );
};

// Only visible on
const CustomChat = () => {
  const permissions = useLocalParticipantPermissions();

  if (permissions?.canPublishData) {
    return <Chat />;
  } else {
    return <></>;
  }
};

export default RoomView;
