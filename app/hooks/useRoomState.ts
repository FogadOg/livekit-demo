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
      const saved_token = localStorage.getItem("roomAdmin-" + room);

      if (saved_token) {
        const { valid, room, expired, canSubscribe } = await validateToken(
          saved_token
        );
        if (valid && canSubscribe) {
          setToken(saved_token);
        } else {
          setRoomExists(false);
          return;
        }
      }

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
  }, [permissionToken, roomId]);

  return { roomExists, expired, roomId };
}
