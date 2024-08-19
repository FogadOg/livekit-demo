import {
  ControlBar,
  ControlBarProps,
  useLocalParticipant,
  useLocalParticipantPermissions,
  useRoomContext,
} from "@livekit/components-react";

import { TrackSource } from "livekit-server-sdk";
import useIsAdmin from "@/app/hooks/useIsAdmin";
import { AdminControls } from "./admin/adminControls";
import { Modal } from "./modal";
import { PauseButton } from "./admin/adminControls/pauseButton";
import { Participant, RemoteParticipant, RoomEvent } from "livekit-client";

interface CustomControlBarProps extends ControlBarProps {
  token: string;
}

export function CustomControlBar({ token, ...props }: CustomControlBarProps) {
  const localParticipant = useLocalParticipant();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const room = useRoomContext();

  const permissions = useLocalParticipantPermissions();
  const isAdmin = useIsAdmin(token);

  room.on(RoomEvent.DataReceived, (payload, participant, kind) => {
    const strData = decoder.decode(payload);
    // console.log(`Got message from ${participant?.identity}`);
    console.log(`Message is ${strData}`);
  });
  return (
    <div className="lk-control-bar">
      {isAdmin && (
        <>
          <Modal
            title="Admin panel"
            content={<AdminControls token={token} />}
            buttonText="View admin panel"
            modelName="adminPanel"
          />
          <PauseButton />
        </>
      )}
      <button
      className="lk-button"
        onClick={() => {
          localParticipant.localParticipant.publishData(
            encoder.encode("Hello"),
            { reliable: true, topic: "EmojiReaction" }
          );
        }}
      >
        Emoji React
      </button>
      <ControlBar
        controls={{
          camera: permissions?.canPublishSources.includes(TrackSource.CAMERA),
          screenShare: permissions?.canPublishSources.includes(
            TrackSource.SCREEN_SHARE
          ),
          microphone: permissions?.canPublishSources.includes(
            TrackSource.MICROPHONE
          ),
        }}
        {...props}
      />
    </div>
  );
}
