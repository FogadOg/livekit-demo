import React, { useState } from "react";

import {
  useTrackTranscription,
  TrackReferenceOrPlaceholder,
  useRoomInfo,
} from "@livekit/components-react";

// Import necessary LiveKit types and styles
import "@livekit/components-styles";

import { appendTranscription } from "@/app/actions/transcription";

export const Transcription = ({
  audioTrack,
  onlyLastSegment = false,
}: {
  audioTrack: TrackReferenceOrPlaceholder;

  onlyLastSegment?: boolean;
}) => {
  const { segments } = useTrackTranscription(audioTrack);
  //Saving only if new entry
  const [savedIndex, setSavedIndex] = useState(0);

  const roomInfo = useRoomInfo();

  if (audioTrack.participant.isLocal) {
    if (
      segments &&
      segments.length > 0 &&
      segments.at(-1)?.final &&
      segments.length > savedIndex
    ) {
      appendTranscription(
        audioTrack.participant.identity,
        Number(roomInfo.name),
        segments.at(-1)?.text! + " "
      );
      setSavedIndex(segments.length);
    }
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
