import React from "react";
import { Transcription } from "./transcription";
import { GetParticipantTrack } from "./getTranscription";

export const TranscriptionTile = ({ identity }: { identity: string }) => {
  const audioTrack = GetParticipantTrack(identity);

  if (!audioTrack) {
    return <></>;
  } else {
    return <Transcription audioTrack={audioTrack} />;
  }
};
