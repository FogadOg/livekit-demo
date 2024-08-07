import { useParticipants, useRoomInfo } from "@livekit/components-react";
import { Participant, Track } from "livekit-client";
import { useState } from "react";
import useIsAdmin from "../hooks/useIsAdmin";
import {
  kickParticipant,
  updateParticipantPermissions,
} from "../actions/userActions";
import { TrackSource } from "livekit-server-sdk";
import { ToggleTrackSource } from "./toggleTrackSource";

import { ControlIcon } from "../assets/conrtolIcon";

export function AdminControls({ token }: { token: string }) {
  const isAdmin = useIsAdmin(token);
  const participants = useParticipants();
  const [open, setOpen] = useState(false);

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
  // console.log(p.permissions?.canPublishSources.includes(TrackSource.MICROPHONE));
  
  return (
    <div role="tablist" className="tabs tabs-bordered">

      {participants.map((p) => (
        <>
          <input type="radio" name="my_tabs_1" role="tab" className="tab text-ellipsis" aria-label={p.identity} />
          <div role="tabpanel" className="tab-content p-10">

            <div className="grid">
              <button className={p.permissions?.canPublishSources.includes(TrackSource.MICROPHONE) ? "btn btn-success" : "btn btn-error"}>
                <ToggleTrackSource
                  trackSource={TrackSource.MICROPHONE}
                  p={p}
                  updateTrackSources={updateTrackSources}
                />
              </button>

              <button className={p.permissions?.canPublishSources.includes(TrackSource.CAMERA) ? "btn btn-success" : "btn btn-error"}>
                <ToggleTrackSource
                  trackSource={TrackSource.CAMERA}
                  p={p}
                  updateTrackSources={updateTrackSources}
                />

              </button>

              <button className={p.permissions?.canPublishSources.includes(TrackSource.SCREEN_SHARE) ? "btn btn-success" : "btn btn-error"}>
                <ToggleTrackSource
                  trackSource={TrackSource.SCREEN_SHARE}
                  p={p}
                  updateTrackSources={updateTrackSources}
                />
              </button>

              <button className={p.permissions?.canPublishSources.includes(TrackSource.SCREEN_SHARE_AUDIO) ? "btn btn-success" : "btn btn-error"}>
                <ToggleTrackSource
                  trackSource={TrackSource.SCREEN_SHARE_AUDIO}
                  p={p}
                  updateTrackSources={updateTrackSources}
                />
              </button>

              {/*TODO User not being fully kicked*/}
              <button
                onClick={async () => {
                  await updateParticipantPermissions(p.identity, token, {
                    canPublishData: p.permissions?.canPublishData,
                  });
                }}
              >
                Hide messaging
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
