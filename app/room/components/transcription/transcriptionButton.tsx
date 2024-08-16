import { Modal } from "@/app/components/modal";
import {
  TrackReferenceOrPlaceholder,
  useEnsureTrackRef,
} from "@livekit/components-react";
import { TranscriptTile } from "./transcriptionTile";

interface TranscriptionButtonProps {
  trackRef?: TrackReferenceOrPlaceholder;
}

export const TranscriptionButton = ({ trackRef }: TranscriptionButtonProps) => {
  const trackReference = useEnsureTrackRef(trackRef);
  const participant = trackReference.participant;
  return (
    <Modal
      title={`${participant.name || participant.identity}s transcription`}
      content={<TranscriptTile participant={participant} />}
      buttonText={`${participant.name || participant.identity}'s transcript`}
      modelName={`${participant.identity}s transcription`}
    />
  );
};
