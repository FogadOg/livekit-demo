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
  TrackReferenceOrPlaceholder,
  useParticipants,
  useEnsureTrackRef,
} from "@livekit/components-react";
import { Modal } from "../component/modal";
import "@livekit/components-styles";
import { RoomEvent, Track } from "livekit-client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Caption from "./transcription/caption";
import { Transcript } from "./transcription/transcript";
import { CustomControlBar } from "../component/customControlBar";
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
        </div>
        <RoomAudioRenderer />
        <CustomControlBar />
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

  const filteredTracks =
    tracks.length > 0
      ? tracks.filter((track) => !track.participant.isAgent)
      : tracks;

  const agentPresent = filteredTracks.length !== tracks.length;
  return (
    <GridLayout
      tracks={filteredTracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <div className="relative">
        <ParticipantTile className="h-full" />
        <div className="absolute top-[75%] origin-top left-[2%] max-w-[96%] xl:top-[80%] xl:left-[20%]  xl:max-w-[65%] bg-[rgba(0,0,0,0.5)] p-2">
          <Caption agentPresent={agentPresent} />
        </div>
      </div>
    </GridLayout>
  );
}

export default RoomView;
