import React, { useEffect, useState } from "react";

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
}: {
  audioTrack: TrackReferenceOrPlaceholder;
}) => {
  const { segments } = useTrackTranscription(audioTrack);
  //Saving only if new entry
  const [savedIndex, setSavedIndex] = useState(0);

  const roomInfo = useRoomInfo();
  useEffect(() => {
    if (audioTrack.participant.isLocal) {
      if (
        segments &&
        segments.length > 0 &&
        segments.at(-1)?.final &&
        segments.length > savedIndex
      ) {
        appendTranscription(
          audioTrack.participant.identity,
          roomInfo.name,
          segments.at(-1)?.text! + " "
        );

        setSavedIndex(segments.length);
      }
    }
  }, [audioTrack, segments, savedIndex]);

  if (segments && segments.length > 0) {
    return <p className="bg-[rgba(0,0,0,0.5)] p-2">{segments.at(-1)?.text}</p>;
  }

  return <p></p>;
};
