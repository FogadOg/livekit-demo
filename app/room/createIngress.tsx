"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { handleCreateIngressForm } from "@/app/actions";

const CreateIngress = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // don't refresh

    const formData = new FormData(event.currentTarget);

    let data = await handleCreateIngressForm(formData);
    if (data.error) {
      setError(data.error);
    } else {
      alert("Url: " + data["url"] + "\nPassword: " + data["password"]);
    }
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
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            className="border-black border-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password if needed:</label>
          <input
            type="text"
            name="password"
            id="password"
            className="border-black border-2 rounded"
          />
        </div>

        <div>
          <input
            type="submit"
            value="Create ingress"
            className="bg-gray-300 hover:bg-gray-400 cursor-pointer rounded p-2"
          />
        </div>
        <p>{error}</p>
      </form>
    </>
  );
};

export default CreateIngress;
