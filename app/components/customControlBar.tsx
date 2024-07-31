import React, { useEffect, useState } from "react";
import {
  ControlBar,
  ControlBarProps,
  useLocalParticipant,
  useRoomContext,
} from "@livekit/components-react";
import { Modal } from "./modal";
import { Transcript } from "../room/components/transcription/transcript";
import { toggleRecording } from "../actions/userActions";
import { RoomEvent } from "livekit-client";

interface CustomControlBarProps extends ControlBarProps {
  customControl?: boolean;
}

export function CustomControlBar({
  customControl = true,
  ...props
}: CustomControlBarProps) {
  // ! Can still record and stop recording if not publish
  const room = useRoomContext();
  const [recording, setRecording] = useState(room.isRecording);
  const participant = useLocalParticipant();

  // Really slow? Even on prependListener instead of on
  room.prependListener(RoomEvent.RecordingStatusChanged, () => {
    setRecording(room.isRecording);
  });

  return (
    <div className="lk-control-bar">
      {customControl && (
        <>
          <Modal
            title="Transcription"
            content={<Transcript roomId={Number(room.name)} />}
            buttonText="View transcript"
          />

          {participant.localParticipant.permissions?.canPublish && (
            <button
              className={"btn lk-button " + (recording ? "!bg-red-500" : "")}
              onClick={() => {
                toggleRecording(room.name);
                setRecording(!recording);
              }}
            >
              Record{recording && "ing"}
            </button>
          )}
        </>
      )}
      <ControlBar {...props} />
    </div>
  );
}
