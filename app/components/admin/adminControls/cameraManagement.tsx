import {
  useParticipants,
  useRoomInfo,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { ParticipantKind, Track } from "livekit-client";
import RoomIngress from "../roomIngress";
import { changeMetaDataToParticipant } from "@/app/actions/metadataAction";

export const CameraManagement = ({ token }: { token: string }) => {
  const cameras = useTracks([Track.Source.Camera]).filter(
    (track) => track.participant.kind === ParticipantKind.INGRESS
  );

  const room = useRoomInfo();
  return (
    <>
      <form className="mb-10 menu">
        {cameras.map((videoRef, index) => {
          return (
            <li key={"camera-" + index}>
              <label
                className="flex justify-between items-center first-letter:capitalize"
                htmlFor={index.toString()}
              >
                {videoRef.participant.name || videoRef.participant.identity}

                {videoRef && <VideoTrack trackRef={videoRef} />}

                <input
                  type="checkbox"
                  name={index.toString()}
                  className="toggle toggle-success"
                  id={index.toString()}
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
        })}
      </form>

      <RoomIngress roomName={room.name} adminToken={token} />
    </>
  );
};
