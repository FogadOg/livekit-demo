import React from 'react';
import { ControlBar, ControlBarProps } from '@livekit/components-react';
import {Modal} from "./modal"
import { Transcript } from "../room/transcription/transcript";

interface CustomControlBarProps extends ControlBarProps {
  customControl?: boolean;
}

export function CustomControlBar({
  customControl = true,
  ...props
}: CustomControlBarProps) {
  return (
    <div className="my-custom-control-bar">
      <ControlBar {...props} />

      {customControl && (
          <Modal
            title="Transcription"
            content={<Transcript />}
            buttonText="View transcript"
          />
      )}
    </div>
  );
}
