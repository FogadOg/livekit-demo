import React from "react";
import {
  LocalParticipant,
  Participant,
  RemoteParticipant,
} from "livekit-client";
import {
  kickParticipant,
  updateParticipantPermissions,
} from "../../../actions/userActions";
import { TrackSource } from "livekit-server-sdk";
import { ToggleTrackSource } from "./toggleTrackSource";

function PermissionPanel({ p, token }: { p: Participant; token: string }) {
  const updateTrackSources = async (
    newSourceList: TrackSource[],
    p: Participant
  ) => {
    await updateParticipantPermissions(p.identity, token, {
      ...p.permissions,
      canPublishSources: Array.from(newSourceList),
    });
  };

  async function toggleChat(p: Participant) {
    if (p.permissions?.canPublishData == true) {
      await updateParticipantPermissions(p.identity, token, {
        ...p.permissions,
        canPublishData: false,
      });
    } else {
      await updateParticipantPermissions(p.identity, token, {
        ...p.permissions,
        canPublishData: true,
      });
    }
  }

  return (
    <div className="grid gap-1">
      <ToggleTrackSource
        trackSource={TrackSource.MICROPHONE}
        p={p}
        updateTrackSources={updateTrackSources}
      />

      <ToggleTrackSource
        trackSource={TrackSource.CAMERA}
        p={p}
        updateTrackSources={updateTrackSources}
      />

      <ToggleTrackSource
        trackSource={TrackSource.SCREEN_SHARE}
        p={p}
        updateTrackSources={updateTrackSources}
      />
      <ToggleTrackSource
        trackSource={TrackSource.SCREEN_SHARE_AUDIO}
        p={p}
        updateTrackSources={updateTrackSources}
      />

      <button
        onClick={async () => {
          toggleChat(p);
        }}
        className={
          p.permissions?.canPublishData ? "btn btn-success" : "btn btn-error"
        }
      >
        chat
      </button>

      <button
        className="btn btn-outline btn-accent mt-10"
        onClick={async () => {
          await kickParticipant(p.identity, token);
        }}
      >
        Kick user
      </button>
    </div>
  );
}

export default PermissionPanel;
