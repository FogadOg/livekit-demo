"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { handleCreateRoomForm } from "@/app/actions/roomActions";

const CreateRoom = () => {
  const [roomPublic, setRoomPublic] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // don't refresh

    setMessage("Creating room...");
    const formData = new FormData(event.currentTarget);

    let { valid, token, expired, newRoomId } = await handleCreateRoomForm(
      formData,
      localStorage.getItem("createToken")!
    );

    if (!valid) {
      if (expired) {
        setMessage("Looks like your create token is expired, redirecting...");
      } else {
        setMessage("Looks like your create token is invalid, redirecting...");
      }
      localStorage.removeItem("createToken");
      window.location.reload();
    }

    if (valid && token && newRoomId) {
      setMessage("Joining room...");
      router.push(`/room?adminToken=${token}`);
      localStorage.setItem("room-" + newRoomId.toString(), token);
    }
  };

  return (
    <div className="card bg-base-100 w-80 shadow-2xl rounded-3xl">
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
          <span className="label-text">Password protected</span>
          <input
            name="public"
            id="public"
            type="checkbox"
            className="checkbox mr-auto ml-2"
            onClick={() => setRoomPublic(!roomPublic)}
            checked={!roomPublic}
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
          <input
            type="submit"
            value="Submit"
            className="btn btn-primary rounded-xl"
          />
        </div>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default CreateRoom;
