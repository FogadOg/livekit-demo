import { Modal } from "../../modal";
import { PermissionControls } from "./permissionControls";
import { InviteUsersForm } from "./inviteUsersForm";
import { PeopleIcon } from "@/app/assets/peopleIcon";
import { InviteIcon } from "@/app/assets/inviteIcon";
import { CameraManagement } from "./cameraManagement";
import { IngressIcon } from "@/app/assets/ingressIcon";
import { PauseButton } from "./pauseButton";

export const AdminControls = ({ token }: { token: string }) => {

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
      <PauseButton/>
    </>
  );
};
