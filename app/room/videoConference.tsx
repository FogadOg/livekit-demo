"use client";

import React from "react";
import {
  useRoomInfo,
} from "@livekit/components-react";

import { CustomGridLayout } from "./components/layouts/customGridLayout";

export const VideoConference = () => {
  const roomInfo = useRoomInfo();
    
  if (roomInfo.metadata?.includes("true")){
    return <div style={{ height: "calc(100vh - var(--lk-control-bar-height))" }} className="w-full flex items-center justify-center"><h2 className="text-4xl">Meeting is paused</h2></div>
  }

  //return <SpeakerLayout tracks={filteredTracks} />;
  return (
    <CustomGridLayout/>
  );
};
