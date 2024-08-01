import { Transcription } from "./transcription";
import { GetParticipantTrack } from "./transcriptionUtils/getTranscription";
import {
  TrackReferenceOrPlaceholder,
  useEnsureTrackRef,
} from "@livekit/components-react";

const Caption = ({
  trackRef,
  agentPresent,
}: {
  trackRef?: TrackReferenceOrPlaceholder;
  agentPresent?: boolean;
}) => {
  const trackReference = useEnsureTrackRef(trackRef);
  const participantTrack = GetParticipantTrack(
    trackReference.participant.identity
  );

  if (!agentPresent) {
    return <p></p>;
  }
  return (
    <div className="flex-1">
      {participantTrack && (
        <Transcription audioTrack={participantTrack} onlyLastSegment={true} />
      )}
    </div>
  );
};

export default Caption;
