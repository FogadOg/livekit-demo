import { addMetadataToRoom } from "@/app/actions/metadataAction";
import { useRoomInfo } from "@livekit/components-react";
import { useEffect, useState } from "react";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { parseMetadata } from "@/app/util/parseMetadata";

export const PauseButton = () => {
  const roomInfo = useRoomInfo();

  const initialPause = !!parseMetadata(roomInfo.metadata!).pause;
  const [paused, setPaused] = useState(initialPause);

  useEffect(() => {
    const newPause = !!parseMetadata(roomInfo.metadata!).pause;
    setPaused(newPause);
  }, [roomInfo.metadata]);

  async function handlePause() {
    addMetadataToRoom(roomInfo.name, "pause", !paused);
    setPaused((isPaused) => !isPaused);
  }

  return (
    <button className="btn lk-button" onClick={handlePause}>
      {paused ? (
        <>
          <PlayArrowIcon /> Unpause
        </>
      ) : (
        <>
          <PauseIcon /> Pause
        </>
      )}
    </button>
  );
};
