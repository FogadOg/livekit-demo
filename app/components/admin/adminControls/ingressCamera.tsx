import {
  TrackReference,
  useRoomInfo,
  VideoTrack,
} from "@livekit/components-react";
import { changeMetaDataToParticipant } from "@/app/actions/metadataAction";

interface IngressCameraProps {
  videoRef: TrackReference;
}
export const IngressCamera = ({ videoRef }: IngressCameraProps) => {
  const room = useRoomInfo();
  return (
    <li>
      <label
        className="flex justify-between items-center first-letter:capitalize"
        htmlFor={videoRef.participant.identity}
      >
        {videoRef.participant.name || videoRef.participant.identity}

        {videoRef && <VideoTrack trackRef={videoRef} />}

        <input
          type="checkbox"
          name={videoRef.participant.identity}
          className="toggle toggle-success"
          id={videoRef.participant.identity}
          checked={videoRef.participant.metadata?.includes("Active")}
          onChange={async () => {
            changeMetaDataToParticipant(
              room.name,
              videoRef.participant.identity,
              videoRef.participant.metadata?.includes("Active")
                ? "Inactive"
                : "Active"
            );
          }}
        />
      </label>
    </li>
  );
};
