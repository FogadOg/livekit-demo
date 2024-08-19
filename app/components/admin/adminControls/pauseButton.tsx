import { addMetadataToRoom } from "@/app/actions/metadataAction";
import { useRoomInfo } from "@livekit/components-react";
import { useEffect, useState } from "react";

export const PauseButton = () => {
  const roomInfo = useRoomInfo();

  const [paused, setPaused] = useState(false);

  async function handlePause() {
    try {
      const parsedData = JSON.parse(roomInfo.metadata!);
      if (!parsedData["pause"]) {
        addMetadataToRoom(roomInfo.name, "pause", true);
        setPaused(true);
      } else {
        addMetadataToRoom(roomInfo.name, "pause", false);
        setPaused(false);
      }
    } catch {
      addMetadataToRoom(roomInfo.name, "pause", false);
      setPaused(false);
    }
  }

  async function isPaused() {
    try {
      const parsedData = JSON.parse(roomInfo.metadata!);
      if (!parsedData["pause"]) {
        return false;
      } else {
        return true;
      }
    } catch {
      return false;
    }
  }

  useEffect(() => {
    const checkPausedStatus = async () => {
      const paused = await isPaused();
      setPaused(paused);
    };

    checkPausedStatus();
  }, []);
  return (
    <button className="btn lk-button" onClick={handlePause}>
      {paused ? "Unpause" : "Pause"}
    </button>
  );
};
