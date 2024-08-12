import {
  useLocalParticipant,
  useParticipants,
} from "@livekit/components-react";
import { Modal } from "../../../components/modal";
import PermissionPanel from "./permissionPanel";

export function PermissionControls({ token }: { token: string }) {
  const identity = useLocalParticipant().localParticipant.identity;
  let participants = useParticipants();

  participants = participants.filter(
    (p) => !p.isAgent && p.identity !== identity
  );

  return (
    <div className="flex flex-wrap">
      {participants.length === 0 ? (
        <p>No users available</p>
      ) : (
        participants.map((p) => (
          <Modal
            key={p.identity}
            title={`${p.identity} permissions`}
            content={<PermissionPanel p={p} token={token} />}
            buttonText={`${p.identity} permissions`}
            modelName={`user ${p.identity} permissions`}
          />
        ))
      )}
    </div>
  );
}
