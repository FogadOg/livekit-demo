"use client";

import React, { useEffect } from "react";
import "@livekit/components-styles";
import "@livekit/components-styles/prefabs";
import EgressHelper from "@livekit/egress-sdk";
import RoomPage from "./egressRoom";

export default function Page() {
  useEffect(() => {
    // Add class to the body
    document.body.classList.add("egress-body");

    // Cleanup function to remove class
    return () => {
      document.body.classList.remove("egress-body");
    };
  }, []);

  return (
    <div className="container w-full">
        <RoomPage
          // EgressHelper retrieves parameters passed to the page
          url={EgressHelper.getLiveKitURL()}
          token={EgressHelper.getAccessToken()}
          layout={EgressHelper.getLayout()}
        />
    </div>
  );
}
