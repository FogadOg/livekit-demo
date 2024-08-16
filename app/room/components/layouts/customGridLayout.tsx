"use client";

import React from "react";
import {
  Chat,
  GridLayout,
  ParticipantTile,
  useLocalParticipantPermissions,
  useRoomInfo,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";
import tracksFilter from "@/app/util/tracksFilter";
import { TranscriptionButton } from "../transcription/transcriptionButton";
import Caption from "../transcription/caption";
import { CustomAudioRenderer } from "@/app/components/customAudioRenderer";


export const CustomGridLayout = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const filteredTracks = tracksFilter(tracks);

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


  //return <SpeakerLayout tracks={filteredTracks} />;
  return (
    <div className="flex">
      <GridLayout
        tracks={filteredTracks}
        style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
      >
        <div className="relative">
          <ParticipantTile className="h-full" />
          <div className="absolute top-10 left-20">
            {transcriptAvailable && <TranscriptionButton/>}
          </div>
          <div className="absolute top-[75%] origin-top left-[2%] max-w-[96%] xl:top-[80%] xl:left-[20%] xl:max-w-[65%]">
            {/* Caption visible if agent present*/}
            {agentPresent && <Caption/>}
          </div>
        </div>
      </GridLayout>
      <CustomAudioRenderer/>
      {/* Chat visible if can chat */}
      {participantPermissions?.canPublishData && <Chat />};
    </div>
  );
};
