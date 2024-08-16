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
import useMuteTrack from "@/app/hooks/useMuteTrack";

interface IngressCameraProps {
  videoRef: TrackReference;
  microphoneRef?: TrackReference;
  adminToken: string;
}
export const IngressCamera = ({
  videoRef,
  microphoneRef,
  adminToken,
}: IngressCameraProps) => {
  const room = useRoomInfo();

  const { trackMuted, setTrackMuted } = useMuteTrack(adminToken, microphoneRef);

  const cameraToggled = videoRef.participant.metadata?.includes("Active");
  const handleToggleCamera = () => {
    changeMetaDataToParticipant(
      room.name,
      videoRef.participant.identity,
      cameraToggled ? "Inactive" : "Active",
      adminToken
    );
  };

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
            onClick={() => setTrackMuted(!trackMuted)}
            className="lk-button mx-auto"
          >
            {trackMuted ? <MicDisabledIcon /> : <MicIcon />}
            Microphone
          </button>
        )}
        <button
          onClick={() => handleToggleCamera()}
          className="lk-button mx-auto"
        >
          {cameraToggled ? <CameraIcon /> : <CameraDisabledIcon />}
          Camera
        </button>
      </div>
    </section>
  );
};
