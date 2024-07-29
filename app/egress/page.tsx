"use client";
import "@livekit/components-styles";
import "@livekit/components-styles/prefabs";
import EgressHelper from "@livekit/egress-sdk";
import RoomPage from "./room";
import React from "react";
export default function Page() {
  return (
    <div className="container">
      <RoomPage
        // EgressHelper retrieves parameters passed to the page
        url={EgressHelper.getLiveKitURL()}
        token={EgressHelper.getAccessToken()}
        layout={EgressHelper.getLayout()}
      />
    </div>
  );
}
