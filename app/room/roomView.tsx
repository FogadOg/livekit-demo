"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutContextProvider,
  Chat,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";

import Caption from "./transcription/caption";
import { CustomControlBar } from "../component/customControlBar";
import { deleteRoomIfEmpty } from "../actions/deleteRoomIfEmpty";

interface RoomProps {
  roomId: string;
  userId: string;
}

const RoomView = ({ roomId, userId }: RoomProps) => {
  const router = useRouter();
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `/api/get-participant-token?room=${roomId}&username=${userId}`
        );

        if (!response.ok) {
          console.error(`Error fetching token: ${response.statusText}`);
          return;
        }

        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    const handleUnload = () => {
      deleteRoomIfEmpty(roomId);
    };

    window.addEventListener("unload", handleUnload);

    fetchToken();

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, [roomId, userId]);

  if (!token) {
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
          deleteRoomIfEmpty(roomId);
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

const MyVideoConference = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const filteredTracks = tracks.filter((track) => !track.participant.isAgent);
  const agentPresent = filteredTracks.length !== tracks.length;

  return (
    <GridLayout
      tracks={filteredTracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <div className="relative">
        <ParticipantTile className="h-full" />
        <div className="absolute top-[75%] origin-top left-[2%] max-w-[96%] xl:top-[80%] xl:left-[20%] xl:max-w-[65%]">
          <Caption agentPresent={agentPresent} />
        </div>
      </div>
    </GridLayout>
  );
};

export default RoomView;
