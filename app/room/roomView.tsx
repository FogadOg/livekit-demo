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
          <Transcript />
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
      <ParticipantTile />
    </GridLayout>
  );
}

function getTranscript(
  identity: string
): TrackReferenceOrPlaceholder | undefined {
  const tracks = useTracks();
  const participants = useParticipants({
    updateOnlyOn: [RoomEvent.ParticipantMetadataChanged],
  });
  const participant = participants.find((p) => p.identity === identity);
  if (!participant) {
    return undefined;
  }

  let participantTrack: TrackReferenceOrPlaceholder | undefined;
  const aat = tracks.find(
    (trackRef) =>
      trackRef.publication.kind === Track.Kind.Audio &&
      trackRef.participant.identity === identity
  );
  if (aat) {
    participantTrack = aat;
  } else if (participant) {
    participantTrack = {
      participant: participant,
      source: Track.Source.Microphone,
    };
  }
  return participantTrack;
}

function TranscriptionTile({ identity }: { identity: string }) {
  const audioTrack = getTranscript(identity);
  if (!audioTrack) {
    return <></>;
  } else {
    return <ActualTranscription audioTrack={audioTrack} />;
  }
}

function ActualTranscription({
  audioTrack,
}: {
  audioTrack: TrackReferenceOrPlaceholder;
}) {
  const { segments } = useTrackTranscription(audioTrack);

  if (segments && segments.length > 0) {
    return <h1>{segments.at(-1)?.text}</h1>;
  } else {
    return <h1>No transcription</h1>;
  }
}
function Transcript() {
  const participants = useParticipants();

  return (
    <div className="flex flex-col gap-16 h-full ">
      <div className="flex-1">
        <p>
          {participants.map((participant) => {
            return (
              <>
                <h1>{participant.identity}:</h1>
                <TranscriptionTile identity={participant.identity} />
              </>
            );
          })}
        </p>
      </div>
    </div>
  );
}

export default RoomView;
