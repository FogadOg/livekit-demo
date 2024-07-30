import React from "react";
import {
  ControlBar,
  ControlBarProps,
  useRoomContext,
  useRoomInfo,
} from "@livekit/components-react";
import { Modal } from "./modal";
import { Transcript } from "../room/components/transcription/transcript";
import { startRecording } from "../actions/userActions";

interface CustomControlBarProps extends ControlBarProps {
  customControl?: boolean;
}

export function CustomControlBar({
  customControl = true,
  ...props
}: CustomControlBarProps) {
  const roomInfo = useRoomInfo();

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
        className="btn lk-button"
        onClick={() => {
          startRecording(roomInfo.name);
        }}
      >
        Record
      </button>
      <ControlBar {...props} />
    </div>
  );
}
