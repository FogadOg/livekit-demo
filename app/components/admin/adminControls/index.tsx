import { useState } from "react";
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
      <div role="tablist" className="tabs tabs-lifted">
        <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Manage ingress" checked/>
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <CameraManagement token={token} />
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab"
          aria-label="Manage ingress"
          />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <PermissionControls token={token} />
        </div>

        <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Invite users" />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <InviteUsersForm token={token} />
        </div>
      </div>
  );
};
