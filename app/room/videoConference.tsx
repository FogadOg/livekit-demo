"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Chat,
  GridLayout,
  ParticipantTile,
  useLocalParticipant,
  useLocalParticipantPermissions,
  useRoomInfo,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";

import Caption from "./components/transcription/caption";
import { TranscriptionButton } from "./components/transcription/transcriptionButton";
import SpeakerLayout from "../egress/SpeakerLayout";
import { CustomAudioRenderer } from "../components/customAudioRenderer";

export const VideoConference = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  const filteredTracks = tracks.filter(
    (track) =>
      !track.participant.isAgent &&
      !track.participant.permissions?.hidden &&
      !(track.participant.metadata === "hello")
  );
  const agentPresent = filteredTracks.length !== tracks.length;

  const participantPermissions = useLocalParticipantPermissions();

  const roomInfo = useRoomInfo();

  const transcriptAvailable = (() => {
    try {
      return !!JSON.parse(roomInfo.metadata || "{}").transcript;
    } catch {
      return false;
    }
  })();

  // return <SpeakerLayout tracks={filteredTracks} />;
  return (
    <div className="flex">
      <GridLayout
        tracks={filteredTracks}
        style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
      >
        <div className="relative">
          <ParticipantTile className="h-full" />
          <div className="absolute top-10 left-20">
            {transcriptAvailable && <TranscriptionButton />}
          </div>
          <div className="absolute top-[75%] origin-top left-[2%] max-w-[96%] xl:top-[80%] xl:left-[20%] xl:max-w-[65%]">
            {/* Caption visible if agent present*/}
            {agentPresent && <Caption />}
          </div>
        </div>
      </GridLayout>
      <CustomAudioRenderer />
      {/* Chat visible if can chat */}
      {participantPermissions?.canPublishData && <Chat />};
    </div>
  );
};
