import { Modal } from "../../modal";
import { PermissionControls } from "./permissionControls";
import { InviteUsersForm } from "./inviteUsersForm";
import { RecordButton } from "./recordButton";
import { PeopleIcon } from "@/app/assets/peopleIcon";
import { InviteIcon } from "@/app/assets/inviteIcon";

export const AdminControls = ({ token }: { token: string }) => {
  return (
    <>
      <Modal
        title="Users permissions"
        content={<PermissionControls token={token} />}
        buttonText="Users permissions"
        modelName="PermissionControls"
        icon={<PeopleIcon />}
      />
      <RecordButton token={token} />

      {/* Invite users */}
      <Modal
        title="Permissions of invite link"
        content={<InviteUsersForm token={token} />}
        buttonText={"Invite users"}
        modelName="InviteUsers"
        icon={<InviteIcon />}
      />
    </>
  );
};
