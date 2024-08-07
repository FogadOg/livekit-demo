import {
  useLocalParticipant,
  useParticipants,
  useRoomInfo,
} from "@livekit/components-react";
import {
  LocalParticipant,
  Participant,
  RemoteParticipant,
  Track,
} from "livekit-client";
import { useState } from "react";
import useIsAdmin from "../hooks/useIsAdmin";
import {
  kickParticipant,
  updateParticipantPermissions,
} from "../actions/userActions";
import { TrackSource } from "livekit-server-sdk";
import { ToggleTrackSource } from "./toggleTrackSource";

import { ControlIcon } from "../assets/controlIcon";

export function AdminControls({ token }: { token: string }) {
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
    <div role="tablist" className="tabs tabs-bordered">
      {participants.map((p) => (
        <>
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab text-ellipsis"
            aria-label={p.identity}
          />
          <div role="tabpanel" className="tab-content p-10">
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

              {/*TODO User not being fully kicked*/}
              <button
                onClick={async () => {
                  toggleChat(p);
                }}
                className={
                  p.permissions?.canPublishData
                    ? "btn btn-success"
                    : "btn btn-error"
                }
              >
                Send chat
              </button>

              {/*TODO User not being fully kicked*/}
              <button
                className="btn btn-outline btn-accent mt-10"
                onClick={async () => {
                  await kickParticipant(p.identity, token);
                }}
              >
                Kick user
              </button>
            </div>
          </div>
        </>
      ))}
    </div>
  );
}
