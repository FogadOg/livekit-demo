import { PermissionControls } from "./permissionControls";
import { InviteUsersForm } from "./inviteUsersForm";
import { IngressManagement } from "./ingressManagement";
import { Layouts } from "./layouts";
import { LayoutChange } from "./layoutChange";
import { PauseButton } from "./pauseButton";
import { deleteRoom } from "@/app/actions/adminActions";
import { useRoomInfo } from "@livekit/components-react";

export const AdminControls = ({ token }: { token: string }) => {
  const roomInfo = useRoomInfo();
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
          aria-label="Room Actions"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6 h-[500px]"
        >
          <h1>Pause room</h1>
          <PauseButton />

          <h1>Change layout</h1>
          <LayoutChange />

          <br />
          <button
            className="btn btn-error"
            onClick={async () => {
              const deletedRoom = await deleteRoom(token, roomInfo.name);
              if (deletedRoom) {
              } else {
                window.location.reload();
              }
            }}
          >
            Delete room
          </button>
        </div>
      </div>
    </div>
  );
};
