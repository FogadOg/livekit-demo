import {
  TrackReference,
  useRoomInfo,
  VideoTrack,
} from "@livekit/components-react";
import { changeMetaDataToParticipant } from "@/app/actions/metadataAction";
import { TrackEvent } from "livekit-client";
import { muteTrack } from "@/app/actions/adminActions";
import { useState } from "react";

interface IngressCameraProps {
  videoRef: TrackReference;
  microphoneRef?: TrackReference;
}
export const IngressCamera = ({
  videoRef,
  microphoneRef,
}: IngressCameraProps) => {
  const room = useRoomInfo();
  const [trackMuted, setTrackMuted] = useState(
    microphoneRef?.publication.isMuted
  );

  if (microphoneRef) {
    microphoneRef.publication.once(TrackEvent.Unmuted, () => {
      console.log("Unmuted");
      setTrackMuted(false);
    });
    microphoneRef.publication.once(TrackEvent.Muted, () => {
      console.log("Muted");
      setTrackMuted(true);
    });
  }
  return (
    <>
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
      {microphoneRef && (
        <button
          onClick={async (e) => {
            e.preventDefault();

            console.log("Muted");
            await muteTrack(
              room.name,
              videoRef.participant.identity,
              microphoneRef?.publication.trackSid!,
              !trackMuted
            );
          }}
        >
          {trackMuted && "un"}mute
        </button>
      )}
    </>
  );
};
