import React, { useEffect, useState } from "react";
import {
  ControlBar,
  ControlBarProps,
  useLocalParticipant,
  useLocalParticipantPermissions,
  useRoomContext,
} from "@livekit/components-react";
import { toggleRecording } from "../actions/userActions";
import { RoomEvent } from "livekit-client";
import { Modal } from "./modal";
import { PermissionForm } from "../room/components/permisitionForm";
import { TrackSource } from "livekit-server-sdk";

interface CustomControlBarProps extends ControlBarProps {
  customControl?: boolean;
}

export function CustomControlBar({
  customControl = true,
  ...props
}: CustomControlBarProps) {
  // ! Can still record and stop recording if not publish
  const room = useRoomContext();
  const [recording, setRecording] = useState(room.isRecording);
  const permissions = useLocalParticipantPermissions();

  // Really slow? Even on prependListener instead of on
  room.prependListener(RoomEvent.RecordingStatusChanged, () => {
    setRecording(room.isRecording);
  });

  return (
    <div className="lk-control-bar">
      {customControl && permissions?.canPublish && (
        <>
          <button
            className={"btn lk-button " + (recording ? "!bg-red-500" : "")}
            onClick={() => {
              toggleRecording(room.name);
              setRecording(!recording);
            }}
          >
            Record{recording && "ing"}
          </button>
          <Modal
            title="Permissions"
            content={<PermissionForm />}
            buttonText="Invite users"
            modelName="premsistionForm"
          />
        </>
      )}
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
