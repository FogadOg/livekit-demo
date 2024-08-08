import { toggleRecording } from "@/app/actions/userActions";
import { RecordIcon } from "@/app/assets/recordIcon";
import { useRoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import { useState } from "react";

export const RecordButton = ({ token }: { token: string }) => {
  const room = useRoomContext();
  const [recording, setRecording] = useState(room.isRecording);
  // Really slow? Even on prependListener instead of on
  room.prependListener(RoomEvent.RecordingStatusChanged, () => {
    setRecording(room.isRecording);
  });
  return (
    <button
      className={"btn lk-button " + (recording ? "!bg-red-500" : "")}
      onClick={() => {
        toggleRecording(room.name, token);
        setRecording(!recording);
      }}
    >
      <RecordIcon />
      Record{recording && "ing"}
    </button>
  );
};
