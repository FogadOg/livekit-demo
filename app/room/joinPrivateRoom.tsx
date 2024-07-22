"use client";

import { useRouter } from "next/navigation";
import React from "react";

const JoinPrivateRoom = () => {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold">Join private room</h1>
      <form>
        <label htmlFor="roomId">Room id:</label>
        <input
          type="text"
          name="roomId"
          id="roomId"
          className="border-black border-2 rounded"
        />
      </form>
      <input
        type="submit"
        value="Join"
        className="bg-gray-300 hover:bg-gray-400 cursor-pointer rounded px-2 py-1"
      />
    </div>
  );
};

export default JoinPrivateRoom;
