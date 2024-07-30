import React, { useEffect, useState } from "react";
import {
  ControlBar,
  ControlBarProps,
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
  const room = useRoomContext();
  const [recording, setRecording] = useState(room.isRecording);

  // Really slow? Even on prependListener instead of on
  room.prependListener(RoomEvent.RecordingStatusChanged, () => {
    setRecording(room.isRecording);
  });

  return (
    <div className="lk-control-bar">
      {customControl && (
        <Modal
          title="Transcription"
          content={<Transcript />}
          buttonText="View transcript"
        />
      )}
      <button
        className={"btn lk-button " + (recording ? "!bg-red-500" : "")}
        onClick={() => {
          toggleRecording(room.name);
          setRecording(!recording);
        }}
      >
        Record{recording && "ing"}
      </button>
      <ControlBar {...props} />
    </div>
  );
}
