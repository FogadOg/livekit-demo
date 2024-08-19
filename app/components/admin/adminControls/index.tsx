import { useState } from "react";
import { Modal } from "../../modal";
import { PermissionControls } from "./permissionControls";
import { InviteUsersForm } from "./inviteUsersForm";
import { IngressManagement } from "./ingressManagement";

export const AdminControls = ({ token }: { token: string }) => {
  const [selectedTab, setSelectedTab] = useState("tab1");

  return (
    <div role="tablist" className="tabs tabs-lifted">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Manage ingress"
        checked={selectedTab === "tab1"}
        onChange={() => setSelectedTab("tab1")}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        hidden={selectedTab !== "tab1"}
      >
        <IngressManagement token={token} />
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Manage permissions"
        checked={selectedTab === "tab2"}
        onChange={() => setSelectedTab("tab2")}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        hidden={selectedTab !== "tab2"}
      >
        <PermissionControls token={token} />
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Invite users"
        checked={selectedTab === "tab3"}
        onChange={() => setSelectedTab("tab3")}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        hidden={selectedTab !== "tab3"}
      >
        <InviteUsersForm token={token} />
      </div>
    </div>
  );
};
