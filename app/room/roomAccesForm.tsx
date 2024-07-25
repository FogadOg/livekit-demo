"use client";

import "@livekit/components-styles";
import { useEffect, useState, FormEvent } from "react";

// ! WARNING
// ! This is not safe, should be rebuilt if not demo
// ! User can use somebody elses name and kick them
// ! User can see room password

interface RoomProps {
  roomId: string;
  userId: string;
  setAccessRoom: Function;
  setUserId: Function;
}

const RoomAccessForm = ({
  roomId,
  setAccessRoom,
  userId,
  setUserId,
}: RoomProps) => {
  const [roomPassword, setRoomPassword] = useState("");
  const [password, setPassword] = useState("");

  const [IsRoomPublic, setIsRoomPublic] = useState(false);

  const [validPassword, setValidPassword] = useState(false);
  const [validUserId, setValidUserId] = useState(false);

  const [participants, setParticipants] = useState(["test"]);
  const [roomExist, setRoomExist] = useState(roomId != null && roomId != "");

  useEffect(() => {
    const fetchRoomState = async () => {
      try {
        const resp = await fetch(`/api/get-room-state?roomId=${roomId}`);
        if (resp.ok) {
          const data = await resp.json();
          setRoomPassword(data["password"]);
          setIsRoomPublic(data["isRoomPublic"]);
          setParticipants(data["participants"]);
          console.log(data);
        } else if (resp.status === 404) {
          setRoomExist(false);
        } else {
          console.error(`Error fetching room: ${resp.statusText}`);
        }
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };

    fetchRoomState();
  }, []);

  useEffect(() => {
    if (validPassword && validUserId) {
      setAccessRoom(true);
    }
  }, [validPassword, validUserId]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === roomPassword) {
      setValidPassword(true);
    } else {
      alert("Incorrect password");
    }
    if (!participants.includes(userId)) {
      setValidUserId(true);
    } else {
      alert("Username taken");
    }
  };

  if (!roomExist) {
    return (
      <>
        <h1 className="font-bold text-xl">Sorry coudln't find the room</h1>
        <p>Coudn't find the room you are looking for</p>
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
          onChange={(e) => setUserId(e.target.value)}
          className="input input-bordered"
          required
        />
      </div>

      {!IsRoomPublic && (
        <div>
          <input
            id="password"
            type="password"
            placeholder="Room password"
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
