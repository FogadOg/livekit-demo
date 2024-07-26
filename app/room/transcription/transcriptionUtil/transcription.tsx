import React, { useState, useEffect } from "react";
import {
  useTrackTranscription,
  TrackReferenceOrPlaceholder,
} from "@livekit/components-react";

// Import necessary LiveKit types and styles
import "@livekit/components-styles";

export const Transcription = ({
  audioTrack,
  onlyLastSegment = false,
}: {
  audioTrack: TrackReferenceOrPlaceholder;

  onlyLastSegment?: boolean;
}) => {
  const { segments } = useTrackTranscription(audioTrack);

  if (segments.length > 0 && !onlyLastSegment) {
    return (
      <p>
        {segments.map((segment) => {
          return <span key={segment.id}>{segment.text + " "}</span>;
        })}
      </p>
    );
  }

  if (onlyLastSegment && segments && segments.length > 0) {
    return <p>{segments.at(-1)?.text}</p>;
  }
  return <p>No transcription available</p>;
};
