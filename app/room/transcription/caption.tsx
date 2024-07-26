import { GetParticipantTrack } from "./transcriptionUtil/getTranscription";
import { Transcription } from "./transcriptionUtil/transcription";
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
    <div className="flex flex-col gap-16 h-full ">
      <div className="flex-1">
        {participantTrack && (
          <Transcription audioTrack={participantTrack} onlyLastSegment={true} />
        )}
      </div>
    </div>
  );
};

export default Caption;
