"use client";

import { getRoomState } from "@/app/actions/userActions";
import "@livekit/components-styles";
import { useEffect, useState, FormEvent } from "react";
import React from "react";
// ! WARNING
// ! This is not safe, should be rebuilt if not demo
// ! User can use somebody else's name and kick them
// ! User can see room password

interface RoomProps {
  roomId: string;
  userId: string;
  setAccessRoom: (access: boolean) => void;
  setUserId: (id: string) => void;
}

const RoomAccessForm = ({
  roomId,
  setAccessRoom,
  userId,
  setUserId,
}: RoomProps) => {
  const [roomPassword, setRoomPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isRoomPublic, setIsRoomPublic] = useState<boolean>(false);

  const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
  const [isValidUserId, setIsValidUserId] = useState<boolean>(false);

  const [participantNames, setParticipantNames] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoomState = async () => {
      const roomState = await getRoomState(roomId);
      if (roomState.valid) {
        setIsRoomPublic(roomState.roomPublic!);
        setParticipantNames(roomState.participantNames!);
      } else {
        // TODO Set room exist false
      }
      setLoading(false);
    };

    fetchRoomState();
  }, [roomId]);

  useEffect(() => {
    if (isValidPassword && isValidUserId) {
      setAccessRoom(true);
    }
  }, [isValidPassword, isValidUserId, setAccessRoom]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === roomPassword) {
      setIsValidPassword(true);
    } else {
      alert("Incorrect password");
      setIsValidPassword(false);
    }
    if (!participantNames.includes(userId)) {
      setIsValidUserId(true);
    } else {
      alert("Username taken");
      setIsValidUserId(false);
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
