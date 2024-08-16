import {
  CameraDisabledIcon,
  CameraIcon,
  MicDisabledIcon,
  MicIcon,
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
    <section className="m-3">
      {videoRef && <VideoTrack trackRef={videoRef} />}
      <div className="flex">
        <p className="text-center font-bold my-auto mx-3">
          Camera name:{" "}
          {videoRef.participant.name || videoRef.participant.identity}
        </p>

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
            className="lk-button mx-auto"
          >
            {trackMuted ? <MicDisabledIcon /> : <MicIcon />}
            Microphone
          </button>
        )}
        <button
          onClick={async (e) => {
            e.preventDefault();
            changeMetaDataToParticipant(
              room.name,
              videoRef.participant.identity,
              videoRef.participant.metadata?.includes("Active")
                ? "Inactive"
                : "Active"
            );
          }}
          className="lk-button mx-auto"
        >
          {videoRef.participant.metadata?.includes("Active") ? (
            <CameraIcon />
          ) : (
            <CameraDisabledIcon />
          )}
          Camera
        </button>
      </div>
    </section>
  );
};
