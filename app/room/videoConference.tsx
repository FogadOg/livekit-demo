"use client";

import React from "react";
import { useRoomInfo, useTracks } from "@livekit/components-react";

import { CustomGridLayout } from "./components/layouts/customGridLayout";
import SpeakerLayout from "./components/layouts/SpeakerLayout";
import { Track } from "livekit-client";
import { parseMetadata } from "../util/parseMetadata";
import useTracksFilter from "../util/useTracksFilter";

export const VideoConference = () => {
  const roomInfo = useRoomInfo();

  try {
    const pause = parseMetadata(roomInfo.metadata!)["pause"];
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

  if (parseMetadata(roomInfo.metadata!)["layout"] == "speaker") {
    return (
      <div style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}>
        <SpeakerLayout />
      </div>
    );
  }

  return <CustomGridLayout />;
};
