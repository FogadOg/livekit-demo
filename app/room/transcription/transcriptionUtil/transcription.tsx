import React, { useState, useEffect } from "react";
import {
  useTrackTranscription,
  TrackReferenceOrPlaceholder,
} from "@livekit/components-react";

// Import necessary LiveKit types and styles
import "@livekit/components-styles";

export const Transcription = ({
  audioTrack,
}: {
  audioTrack: TrackReferenceOrPlaceholder;
}) => {
  const { segments } = useTrackTranscription(audioTrack);

  if (segments.length > 0) {
    return (
      <p>
        {segments.map((segment) => {
          return <span key={segment.id}>{segment.text + " "}</span>;
        })}
      </p>
    );
  }
  return <p>No transcription available</p>;
};
