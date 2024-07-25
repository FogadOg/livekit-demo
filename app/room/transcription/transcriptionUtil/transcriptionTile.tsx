import React from "react";
import { ActualTranscription } from "./actualTranscription";
import { GetTranscript } from "./getTranscription";

export const TranscriptionTile = ({ identity }: { identity: string }) => {
    const audioTrack = GetTranscript(identity);

    if (!audioTrack) {
      return <></>;
    } else {
      return <ActualTranscription audioTrack={audioTrack} />;
    }
  }