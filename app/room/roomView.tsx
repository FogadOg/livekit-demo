"use client";

import {
  LayoutContextProvider,
  Chat,
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  useTrackTranscription,
  useLocalParticipant,
  TrackReferenceOrPlaceholder,
  useRemoteParticipants,
  useParticipants,
} from "@livekit/components-react";

import "@livekit/components-styles";
import { RoomEvent, Track } from "livekit-client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Caption from "./transcription/caption"
interface RoomProps {
  roomId: String;
  userId: String;
}

const RoomView = ({ roomId, userId }: RoomProps) => {
  const router = useRouter();

  const [token, setToken] = useState("");
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${roomId}&username=${userId}`
        );
        if (!resp.ok) {
          console.error(`Error fetching token: ${resp.statusText}`);
          return;
        }
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };

    fetchToken();
  }, [roomId, userId]);

  if (token === "") {
    return <div>Getting token...</div>;
  }

  return (
    <LayoutContextProvider>
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        style={{ height: "100dvh" }}
        onDisconnected={() => {
          router.replace("/");
        }}
      >
        <div className="flex">
          <MyVideoConference />
          <Chat />
          <Caption />
        </div>
        <RoomAudioRenderer />
        <ControlBar />
      </LiveKitRoom>
    </LayoutContextProvider>
  );
};

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <div className="flex flex-col m-5">

        <ParticipantTile />
      </div>
    </GridLayout>
  );
}


export default RoomView;
