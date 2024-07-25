import { TranscriptionTile } from "./transcriptionUtil/transcriptionTile";
import {
  TrackReferenceOrPlaceholder,
  useEnsureTrackRef,
} from "@livekit/components-react";

const Caption = ({ trackRef }: { trackRef?: TrackReferenceOrPlaceholder }) => {
  const trackReference = useEnsureTrackRef(trackRef);

  return (
    <div className="flex flex-col gap-16 h-full ">
      <div className="flex-1">
        <TranscriptionTile identity={trackReference.participant.identity} />
      </div>
    </div>
  );
};

export default Caption;
