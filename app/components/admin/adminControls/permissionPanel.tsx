import React from "react"
import {
  Participant,
} from "livekit-client";
import {
    kickParticipant,
    updateParticipantPermissions,
  } from "../../../actions/userActions";
import { TrackSource } from "livekit-server-sdk";
import { ToggleTrackSource } from "./toggleTrackSource";



function PermissionPanel({p, token}:{ p: Participant, token: string }) {

    const updateTrackSources = async (
      newSourceList: TrackSource[],
      p: Participant
    ) => {
      await updateParticipantPermissions(p.identity, token, {
        canPublishSources: Array.from(newSourceList),
      });
    };


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
                className="btn btn-outline btn-accent mt-10"
                onClick={async () => {
                    await kickParticipant(p.identity, token);
                }}
            >
                Kick user
            </button>
        </div>
    )
}

export default PermissionPanel

