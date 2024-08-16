import { useRoomInfo, useTracks } from "@livekit/components-react";
import {
  ParticipantKind,
  RoomEvent,
  Track,
  TrackEvent,
  TrackPublication,
} from "livekit-client";
import RoomIngress from "../roomIngress";
import { IngressCamera } from "./ingressCamera";
import { TrackInfo } from "livekit-server-sdk";
import { muteTrack, toggleRecording } from "@/app/actions/adminActions";

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
      <form className="mb-10 menu">
        {cameras.map((videoRef, index) => {
          const matchingMicrophone = microphones.find(
            (microphone) =>
              microphone.participant.identity === videoRef.participant.identity
          );
          matchingMicrophone?.publication;
          matchingMicrophone?.publication.once(TrackEvent.Unmuted, () =>
            console.log("Unmuted")
          );
          matchingMicrophone?.publication.once(TrackEvent.Muted, () =>
            console.log("Muted")
          );
          return (
            <>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  await muteTrack(
                    room.name,
                    videoRef.participant.identity,
                    matchingMicrophone?.publication.trackSid!,
                    false
                  );
                }}
              >
                Mute
              </button>
              <IngressCamera
                videoRef={videoRef}
                key={"Ingress-Camera" + index}
              />
            </>
          );
        })}
      </form>

      <RoomIngress roomName={room.name} adminToken={token} />
    </>
  );
};
