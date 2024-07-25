import React from "react";
import { Transcription } from "./transcription";
import { GetTranscript } from "./getTranscription";

export const TranscriptionTile = ({ identity }: { identity: string }) => {
    const audioTrack = GetTranscript(identity);

    if (!audioTrack) {
      return <></>;
    } else {
      return <Transcription audioTrack={audioTrack} />;
    }
  }