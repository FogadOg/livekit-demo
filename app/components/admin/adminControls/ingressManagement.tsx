import { useRoomInfo, useTracks } from "@livekit/components-react";
import { ParticipantKind, Track, TrackEvent } from "livekit-client";
import RoomIngress from "../roomIngress";
import { IngressCamera } from "./ingressCamera";
import {
  addMetadataToRoom,
  getRoomMetadata,
} from "@/app/actions/metadataAction";

export const IngressManagement = ({ token }: { token: string }) => {
  const cameras = useTracks([Track.Source.Camera]).filter(
    (track) => track.participant.kind === ParticipantKind.INGRESS
  );
  const microphones = useTracks([Track.Source.Microphone]).filter(
    (track) => track.participant.kind === ParticipantKind.INGRESS
  );

  const room = useRoomInfo();
  if (cameras.length === 0) {
    return (
      <div>
        <p>No streaming cameras to control</p>
        <RoomIngress roomName={room.name} adminToken={token} />
      </div>
    );
  }
  return (
    <>
      <div className="mb-10">
        {cameras.map((videoRef) => {
          const matchingMicrophone = microphones.find(
            (microphone) =>
              microphone.participant.identity === videoRef.participant.identity
          );

          return (
            <IngressCamera
              videoRef={videoRef}
              microphoneRef={matchingMicrophone}
              key={"Ingress-camera-" + videoRef.participant.identity}
              adminToken={token}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <RoomIngress roomName={room.name} adminToken={token} />
        <label htmlFor="ingressOnly">Ingress only</label>
        <input
          type="checkbox"
          name="ingressOnly"
          id="ingressOnly"
          className="checkbox"
          onChange={(e) => {
            addMetadataToRoom(room.name, "ingressOnly", e.target.checked);
          }}
          checked={
            room.metadata
              ? JSON.parse(room.metadata).ingressOnly ?? false
              : false
          }
        />
      </div>
    </>
  );
};
