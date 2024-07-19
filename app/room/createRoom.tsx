"use client";

import { FormEvent } from "react";

interface CreateRoomProps {
  create: (formData: FormData) => Promise<void>;
}

const CreateRoom = ({ create }: CreateRoomProps) => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(event.currentTarget); // Create FormData from the form

    await create(formData); // Call the server action with FormData
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
