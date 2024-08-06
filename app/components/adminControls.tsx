import {
  useParticipants,
  useRemoteParticipants,
  useRoomInfo,
} from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import { useState } from "react";
import { ControlIcon } from "../assets/conrtolIcon";

export function AdminControls({ token }: { token: string }) {
  const room = useRoomInfo();
  const participants = useParticipants({
    updateOnlyOn: [
      RoomEvent.Connected,
      RoomEvent.ParticipantConnected,
      RoomEvent.ParticipantDisconnected,
      RoomEvent.TrackPublished,
      RoomEvent.TrackUnpublished,
      RoomEvent.TrackMuted,
      RoomEvent.TrackUnmuted,
    ],
  });
  console.log(participants);

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {open && (
        <div className="relative">
          <ol className="absolute bottom-5  ">
            {participants.map((p) => (
              <li key={p.sid} className="flex gap-2">
                <p className="pe-3">{p.identity || <em>unbekannt</em>}</p>
                <p className="">
                  {/* <MicToggle room={room.name} p={p} /> */}
                  <button>MicToggle</button>
                </p>
                <p className="">
                  {/* <CamToggle room={room.name} p={p} /> */}
                  <button>CamToggle</button>
                </p>
                <p className="">
                  {/* <KickButton room={room.name} p={p} /> */}
                  <button>KickButton</button>
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
