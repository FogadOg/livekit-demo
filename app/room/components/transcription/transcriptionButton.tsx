import { Modal } from "@/app/components/modal";
import {
  TrackReferenceOrPlaceholder,
  useEnsureTrackRef,
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
      <p>{trackReference.participant.identity}</p>
      <Modal
        title={`${trackReference.participant.identity}s transcription`}
        content={<TranscriptTile participant={trackReference.participant} />}
        buttonText={`View transcript`}
        modelName={`${trackReference.participant.identity}s transcription`}
      />
    </>
  );
};
