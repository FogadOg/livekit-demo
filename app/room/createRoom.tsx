"use client";

import { FormEvent } from "react";

interface CreateRoomProps {
  create: (formData: FormData) => Promise<void>;
}

const CreateRoom = ({ create }: CreateRoomProps) => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // don't refresh

    const formData = new FormData(event.currentTarget);

    await create(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div>
        <label htmlFor="roomName">Room name:</label>
        <input type="text" name="roomName" id="roomName" />
      </div>
      <div>
        <label htmlFor="roomName">Public:</label>
        <input type="checkbox" name="public" id="public" />
      </div>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
};

export default CreateRoom;
