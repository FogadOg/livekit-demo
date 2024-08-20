"use client";

import React, { useEffect, useState } from "react";
import "@livekit/components-styles";
import "@livekit/components-styles/prefabs";
import EgressHelper from "@livekit/egress-sdk";
import RoomPage from "./egressRoom";

export default function Page() {
  const [liveKitUrl, setLiveKitUrl] = useState("");
  const [token, setToken] = useState("");
  const [layout, setLayout] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLiveKitUrl(EgressHelper.getLiveKitURL());
      setToken(EgressHelper.getAccessToken());
      setLayout(EgressHelper.getLayout());
    }
    // Add class to the body
    document.body.classList.add("egress-body");

    // Cleanup function to remove class
    return () => {
      document.body.classList.remove("egress-body");
    };
  }, []);

  return (
    <div className="container w-full">
      <RoomPage url={liveKitUrl} token={token} layout={layout} />
    </div>
  );
}
