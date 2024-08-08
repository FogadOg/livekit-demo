import { Modal } from "../../modal";
import { PermissionControls } from "./permissionControls";
import { InviteUsersForm } from "./inviteUsersForm";
import { RecordButton } from "./recordButton";

export const AdminControls = ({ token }: { token: string }) => {
  return (
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
  );
};
