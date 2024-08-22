import React, { useEffect, useState } from "react";

import {
  useTrackTranscription,
  TrackReferenceOrPlaceholder,
  useRoomInfo,
  useLocalParticipant,
} from "@livekit/components-react";

// Import necessary LiveKit types and styles
import "@livekit/components-styles";

import { appendTranscription } from "@/app/actions/transcription";
import { ParticipantKind } from "livekit-client";

export const Transcription = ({
  audioTrack,
}: {
  audioTrack: TrackReferenceOrPlaceholder;
}) => {
  const { segments } = useTrackTranscription(audioTrack);
  //Saving only if new entry
  const [savedIndex, setSavedIndex] = useState(0);

  const roomInfo = useRoomInfo();
  const localParticipant = useLocalParticipant().localParticipant;
  const [spokeThreeSecondsAgo, setSpokeThreeSecondsAgo] = useState(false);

  useEffect(() => {
    if (
      audioTrack.participant.isLocal ||
      (localParticipant.identity === "Admin" &&
        audioTrack.participant.kind === ParticipantKind.INGRESS)
    ) {
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
  }, [
    audioTrack,
    segments,
    savedIndex,
    localParticipant.identity,
    roomInfo.name,
  ]);

  useEffect(() => {
    const updateSpokenStatus = () => {
      if (audioTrack.participant.lastSpokeAt instanceof Date) {
        const updatedTimeDifference =
          new Date().getTime() - audioTrack.participant.lastSpokeAt.getTime();
        setSpokeThreeSecondsAgo(updatedTimeDifference >= 4000);
      }
    };

    // Initial update
    updateSpokenStatus();
    const intervalId = setInterval(updateSpokenStatus, 1000);

    return () => clearInterval(intervalId);
  }, [audioTrack.participant.lastSpokeAt]);

  const shouldDisplayCaption =
    segments && segments.length > 0 && !spokeThreeSecondsAgo;

  if (shouldDisplayCaption) {
    return <p className="bg-[rgba(0,0,0,0.5)] p-2">{segments.at(-1)?.text}</p>;
  }

  return <p></p>;
};
