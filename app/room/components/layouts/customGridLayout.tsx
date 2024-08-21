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
import { ParticipantKind, Track } from "livekit-client";
import "@livekit/components-styles";
import useTracksFilter from "@/app/util/useTracksFilter";
import { TranscriptionButton } from "../transcription/transcriptionButton";
import Caption from "../transcription/caption";
import { CustomAudioRenderer } from "@/app/components/customAudioRenderer";
import ChatIndicator from "../chatIndicator";

export const CustomGridLayout = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const filteredTracks = useTracksFilter(tracks);

  const agentPresent = tracks.some(
    (track) => track.participant.kind === ParticipantKind.AGENT
  );

  const participantPermissions = useLocalParticipantPermissions();

  const roomInfo = useRoomInfo();

  const transcriptAvailable = (() => {
    try {
      return !!JSON.parse(roomInfo.metadata || "{}").transcript;
    } catch {
      return false;
    }
  })();

  return (
    <div className="flex">
      <GridLayout
        tracks={filteredTracks}
        style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
      >
        <div className="relative">
          <ParticipantTile className="h-full" />
          <div className="absolute top-10 left-20">
            {transcriptAvailable && (
              <TranscriptionButton hasButtonText={true} />
            )}
          </div>
          <div className="absolute top-[75%] origin-top left-[2%] max-w-[96%] xl:top-[80%] xl:left-[20%] xl:max-w-[65%]">
            {/* Caption visible if agent present*/}
            {agentPresent && <Caption />}
          </div>
        </div>
      </GridLayout>
      <CustomAudioRenderer />
      {/* Chat visible if can chat */}
      {participantPermissions?.canPublishData && <Chat />}
      {participantPermissions?.canPublishData && <ChatIndicator />}
    </div>
  );
};
