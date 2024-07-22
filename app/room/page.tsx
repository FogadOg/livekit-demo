"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import RoomView from "./roomView";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const username = searchParams.get("username");

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [IsRoomPublic, setIsRoomPublic] = useState(false);
  const [passwordCorrect, setPasswordCorrect] = useState(false);

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
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };

    const fetchToken = async () => {
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${roomId}&username=${username}`
        );
        if (!resp.ok) {
          console.error(`Error fetching token: ${resp.statusText}`);
          return;
        }
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };

    fetchRoomState();
    fetchToken();
  }, [roomId, username]);

  const handleSubmit = () => {
    if (password === roomPassword) {
      setPasswordCorrect(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (token === "") {
    return <div>Getting token...</div>;
  }

  if (passwordCorrect || IsRoomPublic || true) {
    return <RoomView roomId={"32"} userId={"helo"} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 ">
      <div>
        <label htmlFor="roomId">Username:</label>
        <input
          name="username"
          id="username"
          type="text"
          placeholder="Username"
          onChange={(e) => setPassword(e.target.value)}
          className="border-black border-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="password">Room password:</label>
        <input
          name="password"
          id="password"
          type="password"
          placeholder="Room password"
          onChange={(e) => setPassword(e.target.value)}
          className="border-black border-2 rounded"
        />
      </div>
      <div>
        <input
          type="submit"
          value="Join"
          className="bg-gray-300 hover:bg-gray-400 cursor-pointer rounded px-2 py-1"
        />
      </div>
    </form>
  );
}
