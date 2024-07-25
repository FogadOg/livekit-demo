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
          <input
            type="text"
            name="roomName"
            id="roomName"
            className="input input-bordered"
            placeholder="Room name"
            required
          />
        </div>

        <label className="label cursor-pointer" htmlFor="public">
          <span className="label-text">Remember me</span>
          <input
            name="public"
            id="public"
            type="checkbox"
            className="checkbox mr-auto ml-2"
            onClick={() => setRoomPublic(!roomPublic)}
          />
        </label>

        {!roomPublic && (
          <div>
            <input
              type="text"
              name="password"
              id="password"
              className="input input-bordered"
              placeholder="Password"
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
