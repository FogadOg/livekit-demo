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

  const [microphoneMuted, setMicrophoneMuted] = useMuteTrack(
    adminToken,
    microphoneRef
  );
  const [cameraMuted, setCameraMuted] = useMuteTrack(adminToken, videoRef);

  const hidden = videoRef.participant.metadata?.includes("Active");
  const handleToggleCamera = () => {
    changeMetaDataToParticipant(
      room.name,
      videoRef.participant.identity,
      hidden ? "Inactive" : "Active",
      adminToken
    );
  };

  return (
    <section className="m-3">
      <h2 className="text-center font-bold my-auto mx-3">
        Ingress name:{" "}
        {videoRef.participant.name || videoRef.participant.identity}
      </h2>
      {videoRef && <VideoTrack trackRef={videoRef} />}
      <div className="flex">
        {microphoneRef && (
          <button
            onClick={() => setMicrophoneMuted((muted) => !muted)}
            className="lk-button mx-auto"
          >
            {!microphoneMuted ? <MicIcon /> : <MicDisabledIcon />}
            Microphone
          </button>
        )}
        <button
          // onClick={() => handleToggleCamera()}
          onClick={() => setCameraMuted((muted) => !muted)}
          className="lk-button mx-auto"
        >
          {!cameraMuted ? <CameraIcon /> : <CameraDisabledIcon />}
          Camera
        </button>

        <label
          htmlFor={"hidden" + videoRef.participant.identity}
          className="my-auto mx-auto flex gap-1"
        >
          Hidden
          <input
            type="checkbox"
            name={"hidden" + videoRef.participant.identity}
            id={"hidden" + videoRef.participant.identity}
            defaultChecked={!hidden}
            onClick={handleToggleCamera}
          />
        </label>
      </div>
    </section>
  );
};
