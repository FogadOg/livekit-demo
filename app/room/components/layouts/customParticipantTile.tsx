"use client";

import React from "react";
import { ParticipantTile, useEnsureTrackRef } from "@livekit/components-react";
import "@livekit/components-styles";
import { TranscriptionButton } from "../transcription/transcriptionButton";
import Caption from "../transcription/caption";

interface CustomParticipantTileProps {
  transcriptAvailable: boolean;
  agentPresent: boolean;
  transcriptButtonText?: boolean;
}
export const CustomParticipantTile = ({
  transcriptAvailable,
  agentPresent,
  transcriptButtonText = false,
}: CustomParticipantTileProps) => {
  return (
    <div className="relative">
      <ParticipantTile className="h-full" />
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
