"use client";

import React from "react";
import {
  Chat,
  useLocalParticipantPermissions,
  useRoomInfo,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { CustomAudioRenderer } from "@/app/components/customAudioRenderer";
import { parseMetadata } from "@/app/util/parseMetadata";
import ChatIndicator from "../chatIndicator";
import { CustomGridLayout } from "./customGridLayout";
import CustomSpeakerLayout from "./customSpeakerLayout";

export const LayoutRenderer = () => {
  const roomInfo = useRoomInfo();
  const participantPermissions = useLocalParticipantPermissions();

  if (parseMetadata(roomInfo.metadata!)["layout"] === "speaker") {
    return (
      <div className="flex">
        <div className="relative flex-1">
          <CustomSpeakerLayout />
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
