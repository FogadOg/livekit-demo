import { useRoomInfo, useTracks } from "@livekit/components-react";
import { ParticipantKind, Track } from "livekit-client";
import RoomIngress from "../roomIngress";
import { IngressCamera } from "./ingressCamera";

export const CameraManagement = ({ token }: { token: string }) => {
  const cameras = useTracks([Track.Source.Camera]).filter(
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
      <form className="mb-10 menu">
        {cameras.map((videoRef, index) => (
          <IngressCamera videoRef={videoRef} key={"Ingress-Camera" + index} />
        ))}
      </form>

      <RoomIngress roomName={room.name} adminToken={token} />
    </>
  );
};