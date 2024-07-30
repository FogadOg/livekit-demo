import React, { useState, useEffect } from "react";
import {
  useTrackTranscription,
  TrackReferenceOrPlaceholder,
  useLocalParticipant,
  useRoomInfo,
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
  const roomInfo = useRoomInfo();

  if (audioTrack.participant.isLocal) {
    console.log("Saving locale");
    console.log(audioTrack.participant.identity);
    console.log(roomInfo.name);
  }

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
    return <p className="bg-[rgba(0,0,0,0.5)] p-2">{segments.at(-1)?.text}</p>;
  }
  if (onlyLastSegment) {
    return <p></p>;
  }
  return <p>User not spoken</p>;
};
