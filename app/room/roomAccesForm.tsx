"use client";

import "@livekit/components-styles";
import { useEffect, useState, FormEvent } from "react";

interface RoomProps {
  roomId: String;
  setAccessRoom: Function;
  setUserId: Function;
}

const RoomAccessForm = ({ roomId, setAccessRoom, setUserId }: RoomProps) => {
  const [roomPassword, setRoomPassword] = useState("");
  const [password, setPassword] = useState("");

  const [IsRoomPublic, setIsRoomPublic] = useState(false);

  const [validPassword, setValidPassword] = useState(false);
  const [validUserId, setValidUserId] = useState(false);

  useEffect(() => {
    const fetchRoomState = async () => {
      try {
        const resp = await fetch(`/api/get-room-state?roomId=${roomId}`);
        if (!resp.ok) {
          console.error(`Error fetching room: ${resp.statusText}`);
          return;
        }
        const data = await resp.json();
        setRoomPassword(data["password"]);
        setIsRoomPublic(data["isRoomPublic"]);
        console.log(data);
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
      setValidUserId(true);
      setValidPassword(true);
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 ">
      <div>
        <label htmlFor="roomId">Username:</label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          onChange={(e) => setUserId(e.target.value)}
          className="border-black border-2 rounded"
          required
        />
      </div>

      {!IsRoomPublic && (
        <div>
          <label htmlFor="password">Room password:</label>
          <input
            id="password"
            type="password"
            placeholder="Room password"
            onChange={(e) => setPassword(e.target.value)}
            className="border-black border-2 rounded"
            required
          />
        </div>
      )}

      <div>
        <input
          type="submit"
          value="Join"
          className="bg-gray-300 hover:bg-gray-400 cursor-pointer rounded px-2 py-1"
        />
      </div>
    </form>
  );
};

export default RoomAccessForm;
