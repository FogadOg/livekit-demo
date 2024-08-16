"use client";

import React from "react";
import { useRoomInfo } from "@livekit/components-react";

import { CustomGridLayout } from "./components/layouts/customGridLayout";

export const VideoConference = () => {
  const roomInfo = useRoomInfo();

  try {
    const pause = JSON.parse(roomInfo.metadata!)["pause"];
    if (pause) {
      return (
        <div
          style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
          className="w-full flex items-center justify-center"
        >
          <h2 className="text-4xl">Meeting is paused</h2>
        </div>
      );
    }
  } catch {}

  //return <SpeakerLayout tracks={filteredTracks} />;
  return <CustomGridLayout />;
};
