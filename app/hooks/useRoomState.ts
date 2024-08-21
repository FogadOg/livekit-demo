import { useEffect, useState } from "react";
import { validateToken } from "../actions/roomActions";
import { getRoomState } from "../actions/userActions";

interface useRoomStateProps {
  permissionToken: string;
  setToken: (token: string) => void;
}
export default function useRoomState({
  permissionToken,
  setToken,
}: useRoomStateProps) {
  const [roomExists, setRoomExists] = useState<boolean>(true);
  const [expired, setExpired] = useState<boolean>(false);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const fetchRoomState = async () => {
      const { valid, room, expired } = await validateToken(permissionToken);

      if (!valid) {
        setExpired(expired!);
        setRoomExists(false);
        return;
      }

      setRoomId(room!);
      const roomState = await getRoomState(room!);
      if (roomState.valid) {
      } else {
        setRoomExists(false);
      }
    };

    fetchRoomState();
  }, [permissionToken, roomId, setToken]);

  return { roomExists, expired, roomId };
}
