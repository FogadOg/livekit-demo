"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { handleCreateRoomForm } from "@/app/actions";

const CreateRoom = () => {
  const [roomPublic, setRoomPublic] = useState(false);
  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // don't refresh

    const formData = new FormData(event.currentTarget);

    let path = await handleCreateRoomForm(formData);
    router.push(path);
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Create room</h1>
      <form onSubmit={handleSubmit} className="flex flex-col ">
        <div>
          <label htmlFor="roomName">Room name:</label>
          <input
            type="text"
            name="roomName"
            id="roomName"
            className="border-black border-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="roomName">Public:</label>
          <input
            type="checkbox"
            name="public"
            id="public"
            onClick={() => setRoomPublic(!roomPublic)}
          />
        </div>

        {!roomPublic && (
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="text"
              name="password"
              id="password"
              className="border-black border-2 rounded"
              required
            />
          </div>
        )}

        <div>
          <input type="submit" value="Submit" className="btn btn-primary" />
        </div>
      </form>
    </>
  );
};

export default CreateRoom;
