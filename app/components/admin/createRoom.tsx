"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { handleCreateRoomForm } from "@/app/actions/roomActions";

const CreateRoom = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // don't refresh

    setMessage("Creating room...");
    const formData = new FormData(event.currentTarget);
    const roomName = formData.get("roomName");

    if (typeof roomName !== "string" || roomName === "") {
      setMessage("Room name is required");
      return;
    }

    let { valid, token, expired, newRoomId, roomNameTaken } =
      await handleCreateRoomForm(
        roomName,
        localStorage.getItem("createToken")!
      );

    if (roomNameTaken) {
      setMessage("Room name taken");
      return;
    }

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
      localStorage.setItem("roomAdmin-" + newRoomId.toString(), token);
      router.push(`/room?roomId=${newRoomId.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col card-body card w-80 shadow-lg rounded-3xl border-base-200 border-2 gap-6"
    >
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

      <div>
        <input
          type="submit"
          value="Submit"
          className="btn btn-primary rounded-xl"
        />
      </div>
      <p>{message}</p>
    </form>
  );
};

export default CreateRoom;
