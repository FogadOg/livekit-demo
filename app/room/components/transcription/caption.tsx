import { Transcription } from "./transcription";
import { GetParticipantTrack } from "./transcriptionUtils/getTranscription";
import {
  TrackReferenceOrPlaceholder,
  useEnsureTrackRef,
} from "@livekit/components-react";

const Caption = ({ trackRef }: { trackRef?: TrackReferenceOrPlaceholder }) => {
  const trackReference = useEnsureTrackRef(trackRef);
  const participantTrack = GetParticipantTrack(
    trackReference.participant.identity
  );

  return (
    <div className="flex-1">
      {participantTrack && <Transcription audioTrack={participantTrack} />}
    </div>
  );
};

export default Caption;
