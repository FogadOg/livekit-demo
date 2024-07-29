"use client";

import React from "react";
import {
  GridLayout,
  ParticipantTile,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";

import Caption from "./components/transcription/caption";



export const VideoConference = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const filteredTracks = tracks.filter((track) => !track.participant.isAgent);
  const agentPresent = filteredTracks.length !== tracks.length;

  return (
    <GridLayout
      tracks={filteredTracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <div className="relative">
        <ParticipantTile className="h-full" />
        <div className="absolute top-[75%] origin-top left-[2%] max-w-[96%] xl:top-[80%] xl:left-[20%] xl:max-w-[65%]">
          <Caption agentPresent={agentPresent} />
        </div>
      </div>
    </GridLayout>
  );
};
