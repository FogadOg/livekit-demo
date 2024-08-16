import { useRoomInfo, useTracks } from "@livekit/components-react";
import { ParticipantKind, Track, TrackEvent } from "livekit-client";
import RoomIngress from "../roomIngress";
import { IngressCamera } from "./ingressCamera";

export const CameraManagement = ({ token }: { token: string }) => {
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
        {cameras.map((videoRef, index) => {
          const matchingMicrophone = microphones.find(
            (microphone) =>
              microphone.participant.identity === videoRef.participant.identity
          );
          matchingMicrophone?.publication;

          return (
            <>
              <IngressCamera
                videoRef={videoRef}
                microphoneRef={matchingMicrophone}
                key={"Ingress-Camera" + index}
              />
            </>
          );
        })}
      </div>

      <RoomIngress roomName={room.name} adminToken={token} />
    </>
  );
};
