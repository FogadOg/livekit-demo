"use client";

import "@livekit/components-styles";
import { useEffect, useState, FormEvent } from "react";

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

  const [participants, setParticipants] = useState<string[]>([]);
  const [roomExists, setRoomExists] = useState<boolean>(
    Boolean(roomId)
  );

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoomState = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/get-room-state?roomId=${roomId}`);
        if (response.ok) {
          const data = await response.json();
          setRoomPassword(data.password || "");
          setIsRoomPublic(data.isRoomPublic || false);
          setParticipants(data.participants || []);
          setRoomExists(true);
        } else if (response.status === 404) {
          setRoomExists(false);
        } else {
          console.error(`Error fetching room: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setRoomExists(false);
      } finally {
        setLoading(false);
      }
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
    if (!participants.includes(userId)) {
      setIsValidUserId(true);
    } else {
      alert("Username taken");
      setIsValidUserId(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-2 m-5">
        <div className="skeleton h-[48px] w-[250px]"></div>
        <div className="skeleton h-[48px] w-[250px]"></div>
        <div className="skeleton h-[48px] w-[62px]"></div>
      </div>
    );
  }

  if (!roomExists) {
    return (
      <>
        <h1 className="font-bold text-xl">Sorry, couldn't find the room</h1>
        <p>Couldn't find the room you are looking for</p>
      </>
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
