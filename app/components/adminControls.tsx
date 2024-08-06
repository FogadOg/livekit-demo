import { useParticipants, useRoomInfo } from "@livekit/components-react";
import { Participant } from "livekit-client";
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
  return (
    <div className="relative">
      {open && (
        <div className="relative">
          <ol className="absolute bottom-5  ">
            {participants.map((p) => (
              <li key={p.sid} className="flex gap-2">
                <p className="pe-3">{p.identity}</p>
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
                <p className="">
                  {/*TODO User not being fully kicked*/}
                  <button
                    onClick={async () => {
                      await updateParticipantPermissions(p.identity, token, {
                        canPublishData: p.permissions?.canPublishData,
                      });
                    }}
                  >
                    Toggle messaging
                  </button>
                </p>
                <p className="">
                  {/*TODO User not being fully kicked*/}
                  <button
                    onClick={async () => {
                      await kickParticipant(p.identity, token);
                    }}
                  >
                    Kick
                  </button>
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      <button
        id="toggle-user-control"
        className="btn lk-button"
        onClick={() => setOpen((cur) => !cur)}
      >
        <ControlIcon/>
        AdminControls
      </button>
    </div>
  );
}
