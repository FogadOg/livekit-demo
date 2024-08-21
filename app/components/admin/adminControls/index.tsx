import { PermissionControls } from "./permissionControls";
import { InviteUsersForm } from "./inviteUsersForm";
import { IngressManagement } from "./ingressManagement";
import { Layouts } from "./layouts";
import { LayoutChange } from "./layoutChange";

export const AdminControls = ({ token }: { token: string }) => {
  return (
    <div>
      <div role="tablist" className="tabs tabs-lifted">
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab h-14 "
          aria-label="Manage ingress"
          defaultChecked
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6 h-[500px]"
        >
          <IngressManagement token={token} />
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab h-14"
          aria-label="Manage users"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6 h-[500px]"
        >
          <PermissionControls token={token} />
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab h-14"
          aria-label="Invite users"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6 h-[500px]"
        >
          <InviteUsersForm token={token} />
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab h-14"
          aria-label="Change layout"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6 h-[500px]"
        >
          <LayoutChange />
        </div>
      </div>
    </div>
  );
};
