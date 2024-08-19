"use client";

import React from "react";
import {
  useRoomInfo,
  useTracks,
} from "@livekit/components-react";

import { CustomGridLayout } from "./components/layouts/customGridLayout";
import SpeakerLayout from "./components/layouts/SpeakerLayout";
import { Track } from "livekit-client";

export const VideoConference = () => {
  const roomInfo = useRoomInfo();
  const roomInfoData = roomInfo.metadata || "{}"
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  
  try {
    if (JSON.parse(roomInfoData)["pause"] === "true") {
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
  return (
    <div style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}>
      <SpeakerLayout tracks={tracks}/>
    </div>
  );
};
