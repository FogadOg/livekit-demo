"use client";

import React, { useState } from "react";
import {
  Chat,
  useLocalParticipantPermissions,
  useRoomInfo,
  useTracks,
} from "@livekit/components-react";

import { CustomGridLayout } from "./components/layouts/customGridLayout";
import SpeakerLayout from "./components/layouts/SpeakerLayout";
import { Track } from "livekit-client";
import { parseMetadata } from "../util/parseMetadata";
import useTracksFilter from "../util/useTracksFilter";
import ChatIndicator from "./components/chatIndicator";
import { CustomAudioRenderer } from "../components/customAudioRenderer";

export const VideoConference = () => {
  const roomInfo = useRoomInfo();
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

        <CustomAudioRenderer />
        {participantPermissions?.canPublishData && (
          <Chat style={{ display: "none" }} />
        )}
        {participantPermissions?.canPublishData && <ChatIndicator />}
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="relative flex-1">
        <CustomGridLayout />
      </div>

      <CustomAudioRenderer />
      {participantPermissions?.canPublishData && (
        <Chat style={{ display: "none" }} />
      )}
      {participantPermissions?.canPublishData && <ChatIndicator />}
    </div>
  );
};
