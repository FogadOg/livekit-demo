"use client";

import React from "react";
import {
  GridLayout,
  TrackReferenceOrPlaceholder,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { CustomParticipantTile } from "./customParticipantTile";

interface customLayoutProps {
  tracks: TrackReferenceOrPlaceholder[];
  agentPresent: boolean;
  transcriptAvailable: boolean;
}
export const CustomGridLayout = ({
  tracks,
  agentPresent,
  transcriptAvailable,
}: customLayoutProps) => {
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <CustomParticipantTile
        agentPresent={agentPresent}
        transcriptAvailable={transcriptAvailable}
      />
    </GridLayout>
  );
};
