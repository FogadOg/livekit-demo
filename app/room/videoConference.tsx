"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Chat,
  GridLayout,
  ParticipantTile,
  TrackReferenceOrPlaceholder,
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
import tracksFilter from "../util/tracksFilter";
import { CustomGridLayout } from "./components/layouts/customGridLayout";

export const VideoConference = () => {
  const roomInfo = useRoomInfo();
    
  if (roomInfo.metadata?.includes("true")){
    return <div style={{ height: "calc(100vh - var(--lk-control-bar-height))" }} className="w-full flex items-center justify-center"><h2 className="text-4xl">Meeting is paused</h2></div>
  }

  //return <SpeakerLayout tracks={filteredTracks} />;
  return (
    <CustomGridLayout/>
  );
};
