"use client";

import { validateToken } from "@/app/actions/roomActions";
import {
  getRoomState,
  validatedRoomPasswordAndUsername,
} from "@/app/actions/userActions";
import "@livekit/components-styles";
import { useState, FormEvent } from "react";
import React from "react";

interface RoomProps {
  submitUsernameAndPassword: (
    userId: string,
    password: string
  ) => Promise<void>;
  isRoomPublic: boolean;
}

const RoomAccessForm = ({
  submitUsernameAndPassword,
  isRoomPublic,
}: RoomProps) => {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitUsernameAndPassword(userId, password);
  };

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
