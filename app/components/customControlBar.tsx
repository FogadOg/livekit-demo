import React, { useEffect, useState } from "react";
import {
  ControlBar,
  ControlBarProps,
  useLocalParticipantPermissions,
  useRoomContext,
} from "@livekit/components-react";
import { toggleRecording } from "../actions/userActions";
import { RoomEvent } from "livekit-client";
import { Modal } from "./modal";
import { PermissionForm } from "../room/components/permisitionForm";
import { TrackSource } from "livekit-server-sdk";
import useIsAdmin from "@/app/hooks/useIsAdmin";
import { AdminControls } from "./adminControls";
import { RecordIcon } from "../assets/recordIcon";
import { PeopleIcon } from "../assets/peopleIcon";
interface CustomControlBarProps extends ControlBarProps {
  customControl?: boolean;
  token: string;
}

export function CustomControlBar({
  customControl = true,
  token,
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

  const isAdmin = useIsAdmin(token);
  return (
    <div className="lk-control-bar">
      {customControl && (
        <>
          {isAdmin && (
            <>
              <Modal
                title="Admin controls"
                content={<AdminControls token={token} />}
                buttonText="Admin controls"
                modelName="adminControls"
              />
              
              {/* Starts egress */}
              <button
                className={"btn lk-button " + (recording ? "!bg-red-500" : "")}
                onClick={() => {
                  toggleRecording(room.name, token);
                  setRecording(!recording);
                }}
              >
                <RecordIcon/>
                Record{recording && "ing"}
              </button>

              {/* Invite users */}
              <Modal
                title="Permissions"
                content={<PermissionForm token={token} />}
                buttonText={"Invite users"}
                modelName="premsistionForm"
              />
            </>
          )}
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
