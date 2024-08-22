"use client";

import React from "react";
import {
  ParticipantTile,
  TrackReferenceOrPlaceholder,
  useEnsureTrackRef,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { TranscriptionButton } from "../transcription/transcriptionButton";
import Caption from "../transcription/caption";
import { ParticipantKind } from "livekit-client";

interface CustomParticipantTileProps {
  transcriptAvailable: boolean;
  agentPresent: boolean;
  transcriptButtonText?: boolean;
  trackRef?: TrackReferenceOrPlaceholder;
}
export const CustomParticipantTile = ({
  transcriptAvailable,
  agentPresent,
  transcriptButtonText = false,
  trackRef,
}: CustomParticipantTileProps) => {
  const trackReference = useEnsureTrackRef(trackRef);
  const isIngress = trackReference.participant.kind === ParticipantKind.INGRESS;
  return (
    <div className="relative">
      <ParticipantTile className={"h-full " + (isIngress ? "ingress" : "")} />
      <div className="absolute top-5 left-5">
        {transcriptAvailable && (
          <TranscriptionButton hasButtonText={transcriptButtonText} />
        )}
      </div>
      <div className="absolute top-[75%] origin-top left-[2%] max-w-[96%] xl:top-[80%] xl:left-[20%] xl:max-w-[65%]">
        {/* Caption visible if agent present*/}
        {agentPresent && <Caption />}
      </div>
    </div>
  );
};
