"use client";

import {
  useLocalParticipantPermissions,
  useRoomInfo,
} from "@livekit/components-react";

import { parseMetadata } from "../util/parseMetadata";
import { LayoutRenderer } from "./components/layouts/layoutRenderer";

export const VideoConference = () => {
  const roomInfo = useRoomInfo();

  if (parseMetadata(roomInfo.metadata!)["pause"]) {
    return (
      <div
        style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
        className="w-full flex items-center justify-center"
      >
        <h2 className="text-4xl">Meeting is paused</h2>
      </div>
    );
  }
  return <LayoutRenderer />;
};
