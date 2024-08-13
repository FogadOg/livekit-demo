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
  onlyLastSegment = false,
}: {
  audioTrack: TrackReferenceOrPlaceholder;

  onlyLastSegment?: boolean;
}) => {
  const { segments } = useTrackTranscription(audioTrack);
  //Saving only if new entry
  const [savedIndex, setSavedIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  const roomInfo = useRoomInfo();
  useEffect(() => {
    if (audioTrack.participant.isLocal) {
      if (
        segments &&
        segments.length > 0 &&
        segments.at(-1)?.final &&
        segments.length > savedIndex
      ) {
        setHidden(false);
        appendTranscription(
          audioTrack.participant.identity,
          roomInfo.name,
          segments.at(-1)?.text! + " "
        );

        setSavedIndex(segments.length);
      }
    }
  }, [audioTrack, segments, savedIndex]);

  const checkForOutdatedCaption = () => {
    if (segments && segments.length > 0) {
      const receivedAt = segments.at(-1)?.receivedAt!;

      const currentTime = Date.now();
      const elapsedTime = currentTime - receivedAt;
      if (elapsedTime > 1000) {
        setHidden(true);
      }
    }
  };

  useEffect(() => {
    if (hidden) {
      return;
    }

    const interval = setInterval(checkForOutdatedCaption, 3000);
    return () => clearInterval(interval);
  }, [segments, hidden]);

  if (segments.length > 0 && !onlyLastSegment) {
    return (
      <p>
        {segments.map((segment) => {
          return <span key={segment.id}>{segment.text + " "}</span>;
        })}
      </p>
    );
  }

  if (onlyLastSegment && segments && segments.length > 0 && !hidden) {
    return <p className="bg-[rgba(0,0,0,0.5)] p-2">{segments.at(-1)?.text}</p>;
  }

  if (onlyLastSegment) {
    return <p></p>;
  }
  return <p>User not spoken</p>;
};
