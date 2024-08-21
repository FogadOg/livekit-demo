"use client";

import React from "react";
import {
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
import { CustomParticipantTile } from "./customParticpantTile";

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
    <GridLayout
      tracks={filteredTracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <CustomParticipantTile
        agentPresent={agentPresent}
        transcriptAvailable={transcriptAvailable}
      />
    </GridLayout>
  );
};
