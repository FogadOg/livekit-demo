import { useParticipants, useRoomInfo } from "@livekit/components-react";
import { LocalParticipant, Participant, RemoteParticipant, Track } from "livekit-client";
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
  
  async function toggleChat(p: RemoteParticipant | LocalParticipant) {
    console.log("p.permissions?.canPublishData: ",p.permissions?.canPublishData);
    
    if(p.permissions?.canPublishData == true) {
      console.log("sat to false");
      
      await updateParticipantPermissions(p.identity, token, {
        canPublishData: false,
      });
      console.log("finish");


    }else {
      console.log("sat to true");

      await updateParticipantPermissions(p.identity, token, {
        canPublishData: true,
      });
      console.log("finish");

    }
  }
  
  return (
    <div role="tablist" className="tabs tabs-bordered">

      {participants.map((p) => (
        <>
          <input type="radio" name="my_tabs_1" role="tab" className="tab text-ellipsis" aria-label={p.identity} />
          <div role="tabpanel" className="tab-content p-10">

            <div className="grid gap-1">
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
              {/*<button
                onClick={async () => {toggleChat(p)}}
              >
                Hide chat
              </button>*/}

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
