import {
  useLocalParticipant,
  useParticipants,
  useRoomInfo,
} from "@livekit/components-react";
import {
  LocalParticipant,
  Participant,
  RemoteParticipant,
} from "livekit-client";
import useIsAdmin from "../../../hooks/useIsAdmin";
import {
  kickParticipant,
  updateParticipantPermissions,
} from "../../../actions/userActions";
import { TrackSource } from "livekit-server-sdk";
import { ToggleTrackSource } from "./toggleTrackSource";
import { Modal } from "../../../components/modal"
import PermissionPanel from "./permissionPanel"

// TODO no users to contrll
export function PermissionControls({ token }: { token: string }) {
  const isAdmin = useIsAdmin(token);
  const identity = useLocalParticipant().localParticipant.identity;
  let participants = useParticipants();
  participants = participants.filter(
    (p) => !p.isAgent && p.identity !== identity
  );

  const updateTrackSources = async (
    newSourceList: TrackSource[],
    p: Participant
  ) => {
    await updateParticipantPermissions(p.identity, token, {
      canPublishSources: Array.from(newSourceList),
    });
  };
  if (!isAdmin) {
    return <></>;
  }

  async function toggleChat(p: RemoteParticipant | LocalParticipant) {
    if (p.permissions?.canPublishData == true) {
      await updateParticipantPermissions(p.identity, token, {
        canPublishData: false,
        canPublishSources: p.permissions?.canPublishSources,
      });
    } else {
      await updateParticipantPermissions(p.identity, token, {
        canPublishData: true,
        canPublishSources: p.permissions?.canPublishSources,
      });
    }
  }

  return (
    <div className="flex flex-wrap">
      {participants.map((p) => (
        <Modal
          title={`${p.identity} permissions`}
          content={<PermissionPanel p={p} token={token} />}
          buttonText={`${p.identity} permissions`}
          modelName={`user ${p.identity} permissions`}
        />
      ))}
    </div>
  );
}
