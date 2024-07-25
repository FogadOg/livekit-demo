import {
    useTracks,
    useTrackTranscription,
    TrackReferenceOrPlaceholder,
    useParticipants,
  } from "@livekit/components-react";
  
  import "@livekit/components-styles";
  import { RoomEvent, Track } from "livekit-client";
  import React from "react";

  
export const ActualTranscription =({
    audioTrack,
  }: {
    audioTrack: TrackReferenceOrPlaceholder;
  }) => {
    const { segments } = useTrackTranscription(audioTrack);
  
    if (segments && segments.length > 0) {
      return <h1>{segments.at(-1)?.text}</h1>;
    } else {
      return <h1>No transcription</h1>;
    }
  }

