"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { handleCreateRoomForm } from "@/app/actions/deleteRoomIfEmpty";

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
    <div className="card bg-base-100 w-80 shadow-md border">
      <form onSubmit={handleSubmit} className="flex flex-col card-body">
        <h2 className="text-2xl font-bold card-title">Create room</h2>
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
          <span className="label-text">Public</span>
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
    </div>
  );
};

export default CreateRoom;
