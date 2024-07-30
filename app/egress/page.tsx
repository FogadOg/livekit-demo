"use client";

import React, { useEffect } from "react";
import "@livekit/components-styles";
import "@livekit/components-styles/prefabs";
import EgressHelper from "@livekit/egress-sdk";
import RoomPage from "./egressRoom";
import { LayoutContextProvider } from "@livekit/components-react";

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
    <div className="container">
      <LayoutContextProvider>
        <RoomPage
          // EgressHelper retrieves parameters passed to the page
          url={EgressHelper.getLiveKitURL()}
          token={EgressHelper.getAccessToken()}
          layout={EgressHelper.getLayout()}
        />
      </LayoutContextProvider>
    </div>
  );
}
