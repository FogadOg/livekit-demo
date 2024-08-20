import { Modal } from "@/app/components/modal";
import {
  TrackReferenceOrPlaceholder,
  useEnsureTrackRef,
} from "@livekit/components-react";
import { TranscriptTile } from "./transcriptionTile";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

interface TranscriptionButtonProps {
  hasButtonText?: boolean
  icon?: JSX.Element
  trackRef?: TrackReferenceOrPlaceholder;
}

export const TranscriptionButton = ({ trackRef, icon, hasButtonText = false }: TranscriptionButtonProps) => {
  const trackReference = useEnsureTrackRef(trackRef);
  const participant = trackReference.participant;
  return (
    <Modal
      title={`${participant.name || participant.identity}s transcription`}
      content={<TranscriptTile participant={participant} />}
      buttonText={hasButtonText ? `${participant.name || participant.identity}'s transcript`:""}
      modelName={`${participant.identity}s transcription`}
      icon={<RecordVoiceOverIcon/>}
    />
  );
};
