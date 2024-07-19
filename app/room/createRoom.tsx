"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { handleCreateRoomForm } from "@/app/actions";

const CreateRoom = () => {
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
            className="bg-black border-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="roomName">Public:</label>
          <input type="checkbox" name="public" id="public" />
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    </>
  );
};

export default CreateRoom;
