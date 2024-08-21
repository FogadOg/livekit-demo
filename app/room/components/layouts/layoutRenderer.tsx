"use client";

import React from "react";
import {
  Chat,
  useLocalParticipantPermissions,
  useRoomInfo,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { CustomAudioRenderer } from "@/app/components/customAudioRenderer";
import { parseMetadata } from "@/app/util/parseMetadata";
import ChatIndicator from "../chatIndicator";
import { CustomGridLayout } from "./customGridLayout";
import CustomSpeakerLayout from "./customSpeakerLayout";
import useTracksFilter from "@/app/util/useTracksFilter";
import { Track, ParticipantKind } from "livekit-client";

export const LayoutRenderer = () => {
  const roomInfo = useRoomInfo();
  const participantPermissions = useLocalParticipantPermissions();
  const isSpeakerLayout =
    parseMetadata(roomInfo.metadata!)["layout"] === "speaker";

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

  const transcriptAvailable = (() => {
    try {
      return !!JSON.parse(roomInfo.metadata || "{}").transcript;
    } catch {
      return false;
    }
  })();

  return (
    <div className="flex">
      <div className="relative flex-1">
        {isSpeakerLayout ? (
          <CustomSpeakerLayout
            tracks={filteredTracks}
            transcriptAvailable={transcriptAvailable}
            agentPresent={agentPresent}
          />
        ) : (
          <CustomGridLayout
            tracks={filteredTracks}
            transcriptAvailable={transcriptAvailable}
            agentPresent={agentPresent}
          />
        )}
      </div>

      <CustomAudioRenderer />
      {participantPermissions?.canPublishData && (
        <Chat style={{ display: "none" }} />
      )}
      {participantPermissions?.canPublishData && <ChatIndicator />}
    </div>
  );
};
