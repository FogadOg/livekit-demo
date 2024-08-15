import { Modal } from "../../modal";
import { PermissionControls } from "./permissionControls";
import { InviteUsersForm } from "./inviteUsersForm";
import { PeopleIcon } from "@/app/assets/peopleIcon";
import { InviteIcon } from "@/app/assets/inviteIcon";
import { addMetadataToRoom } from "@/app/actions/metadataAction";
import { useRoomInfo } from "@livekit/components-react";
import { CameraManagement } from "./cameraManagement";
import { IngressIcon } from "@/app/assets/ingressIcon";
import { useEffect, useState } from "react";

export const AdminControls = ({ token }: { token: string }) => {
  const roomInfo = useRoomInfo();

  const [paused, setPaused] = useState(false);

  async function handlePause() {
    try {
      const parsedData = JSON.parse(roomInfo.metadata!);
      if (parsedData["pause"] === "false") {
        addMetadataToRoom(roomInfo.name, "pause", "true");
        setPaused(true);
      } else {
        addMetadataToRoom(roomInfo.name, "pause", "false");
        setPaused(false);
      }
    } catch {
      addMetadataToRoom(roomInfo.name, "pause", "false");
      setPaused(false);
    }
  }

  async function isPaused() {
    try {
      const parsedData = JSON.parse(roomInfo.metadata!);
      if (parsedData["pause"] === "false") {
        return false;
      } else {
        return true;
      }
    } catch {
      return false;
    }
  }

  useEffect(() => {
    const checkPausedStatus = async () => {
      const paused = await isPaused();
      setPaused(paused);
    };

    checkPausedStatus();
  }, []);

  return (
    <>
      <Modal
        title="Manage ingress"
        content={<CameraManagement token={token} />}
        buttonText={"Manage ingress"}
        modelName="ingressManager"
        icon={<IngressIcon />}
      />
      <Modal
        title="Users permissions"
        content={<PermissionControls token={token} />}
        buttonText="Users permissions"
        modelName="PermissionControls"
        icon={<PeopleIcon />}
      />

      {/* Invite users */}
      <Modal
        title="Permissions of invite link"
        content={<InviteUsersForm token={token} />}
        buttonText={"Invite users"}
        modelName="InviteUsers"
        icon={<InviteIcon />}
      />
      <button className="btn lk-button" onClick={handlePause}>
        {paused ? "Unpause" : "Pause"}
      </button>
    </>
  );
};
