"use client";

import {
  getRoomState,
  validatedRoomPasswordAndUsername,
} from "@/app/actions/userActions";
import "@livekit/components-styles";
import { useEffect, useState, FormEvent } from "react";
import React from "react";

interface RoomProps {
  roomId: string;
  setToken: (token: string) => void;
  permissionToken: string;
}

const RoomAccessForm = ({ roomId, setToken, permissionToken }: RoomProps) => {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isRoomPublic, setIsRoomPublic] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoomState = async () => {
      const roomState = await getRoomState(roomId);
      if (roomState.valid) {
        setIsRoomPublic(roomState.roomPublic!);
      } else {
        // TODO Set room exist false
      }
      setLoading(false);
    };

    fetchRoomState();
  }, [roomId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let { message, token } = await validatedRoomPasswordAndUsername(
      roomId,
      userId,
      password,
      permissionToken
    );
    if (token) {
      setToken(token);
    }
    if (message !== "") {
      alert(message);
    }
  };

  if (loading || roomId === "") {
    return (
      <div className="flex flex-col gap-2 m-5">
        <div className="skeleton h-[48px] w-[250px]"></div>
        <div className="skeleton h-[48px] w-[250px]"></div>
        <div className="skeleton h-[48px] w-[62px]"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 m-5">
      <div>
        <input
          id="username"
          type="text"
          placeholder="Username"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="input input-bordered"
          required
        />
      </div>

      {!isRoomPublic && (
        <div>
          <input
            id="password"
            type="password"
            placeholder="Room password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered"
            required
          />
        </div>
      )}

      <div>
        <input type="submit" value="Join" className="btn btn-primary" />
      </div>
    </form>
  );
};

export default RoomAccessForm;
