import { Modal } from "@/app/components/modal";
import {
  TrackReferenceOrPlaceholder,
  useEnsureTrackRef,
  useParticipantContext,
} from "@livekit/components-react";
import { TranscriptTile } from "./transcriptionTile";

export const TranscriptionButton = ({
  trackRef,
}: {
  trackRef?: TrackReferenceOrPlaceholder;
}) => {
  const trackReference = useEnsureTrackRef(trackRef);
  return (
    <>
      <Modal
        title={`${trackReference.participant.identity}s transcription`}
        content={<TranscriptTile participant={trackReference.participant} />}
        buttonText={`${trackReference.participant.identity}'s transcript`}
        modelName={`${trackReference.participant.identity}s transcription`}
      />
    </>
  );
};
