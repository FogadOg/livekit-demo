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
  const [segmentsDict, setSegmentsDict] = useState<{ [key: string]: string }>(
    {}
  );

  const { segments } = useTrackTranscription(audioTrack);

  useEffect(() => {
    if (segments) {
      setSegmentsDict((prevSegmentsDict) => {
        const updatedDict = { ...prevSegmentsDict };
        updatedDict[audioTrack.participant.identity] = "";

        segments.forEach((segment) => {
          updatedDict[audioTrack.participant.identity] += segment.text + " ";
        });

        return updatedDict;
      });
    }
  }, [segments, audioTrack.participant.identity]);

  const latestSegmentKey = Object.keys(segmentsDict).pop();
  const latestSegmentText = latestSegmentKey
    ? segmentsDict[latestSegmentKey]
    : "No transcription available";

  return <p>{latestSegmentText}</p>;
};
