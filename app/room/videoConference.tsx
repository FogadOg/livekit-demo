"use client";

import React, { useState } from "react";
import { Chat, useLocalParticipantPermissions, useRoomInfo, useTracks } from "@livekit/components-react";

import { CustomGridLayout } from "./components/layouts/customGridLayout";
import SpeakerLayout from "./components/layouts/SpeakerLayout";
import { Track } from "livekit-client";
import { parseMetadata } from "../util/parseMetadata";
import useTracksFilter from "../util/useTracksFilter";

export const VideoConference = () => {
  const roomInfo = useRoomInfo();
  const [layout, setLayout] = useState(<CustomGridLayout />)
  const participantPermissions = useLocalParticipantPermissions();

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
      <div className="flex">
        <div className="relative flex-1">
          <SpeakerLayout />
        </div>
        {participantPermissions?.canPublishData && <Chat />}
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="relative flex-1"> 
        <CustomGridLayout />
      </div>
      {participantPermissions?.canPublishData && <Chat />}
    </div>
  )
};
