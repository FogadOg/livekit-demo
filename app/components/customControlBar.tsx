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
import { InviteUsersForm } from "./admin/adminControls/inviteUsersForm";
import { TrackSource } from "livekit-server-sdk";
import useIsAdmin from "@/app/hooks/useIsAdmin";
import { PermissionControls } from "./admin/adminControls/permissionControls";
import { RecordIcon } from "../assets/recordIcon";
import { PeopleIcon } from "../assets/peopleIcon";
import { RecordButton } from "./admin/adminControls/recordButton";
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

  const permissions = useLocalParticipantPermissions();

  const isAdmin = useIsAdmin(token);
  return (
    <div className="lk-control-bar">
      {customControl && (
        <>
          {isAdmin && (
            <>
              <Modal
                title="Users permissions"
                content={<PermissionControls token={token} />}
                buttonText="Users permissions"
                modelName="PermissionControls"
              />
              <RecordButton token={token} />

              {/* Invite users */}
              <Modal
                title="Permissions of invite link"
                content={<InviteUsersForm token={token} />}
                buttonText={"Invite users"}
                modelName="InviteUsers"
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
