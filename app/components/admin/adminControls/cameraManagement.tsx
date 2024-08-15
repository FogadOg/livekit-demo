import {
  isTrackReference,
  ParticipantContext,
  TrackRefContext,
  TrackReference,
  useMaybeTrackRefContext,
  useParticipants,
  useRoomInfo,
  useTrackByName,
  VideoTrack,
} from "@livekit/components-react";
import {
  ParticipantKind,
  RemoteVideoTrack,
  Track,
  TrackPublication,
} from "livekit-client";
import RoomIngress from "../roomIngress";
import { changeMetaDataToParticipant } from "@/app/actions/metadataAction";

export const CameraManagement = ({ token }: { token: string }) => {
  const cameras = useParticipants().filter(
    (p) => p.kind === ParticipantKind.INGRESS
  );
  const room = useRoomInfo();
  return (
    <>
      <form className="mb-10 menu">
        {cameras.map((camera, index) => {
          let videoRef = undefined;

          let audioRef = undefined;
          camera.videoTrackPublications.forEach((value, key) => {
            console.log(key);
            console.log(value);
            if (value.track) {
              if (value.kind == Track.Kind.Video) {
                videoRef = {
                  participant: camera,
                  publication: value,
                  source: value.track.source,
                };
              }
            }
          });

          console.log(audioRef);
          return (
            <li key={"camera-" + index}>
              <label
                className="flex justify-between items-center first-letter:capitalize"
                htmlFor={index.toString()}
              >
                {camera.name || camera.identity}

                {videoRef && <VideoTrack trackRef={videoRef} />}

                <input
                  type="checkbox"
                  name={index.toString()}
                  className="toggle toggle-success"
                  id={index.toString()}
                  checked={camera.metadata?.includes("Active")}
                  onChange={async () => {
                    changeMetaDataToParticipant(
                      room.name,
                      camera.identity,
                      camera.metadata?.includes("Active")
                        ? "Inactive"
                        : "Active"
                    );
                  }}
                />
              </label>
            </li>
          );
        })}
      </form>

      <RoomIngress roomName={room.name} adminToken={token} />
    </>
  );
};
