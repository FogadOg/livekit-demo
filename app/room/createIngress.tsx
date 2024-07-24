"use client";

import { FormEvent, useState } from "react";
import { handleCreateIngressForm } from "@/app/actions";

type IngressData = {
  url?: string;
  password?: string;
};

const CreateIngress = () => {
  const [error, setError] = useState("");
  const [data, setData] = useState<IngressData>({});
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setError("");
    event.preventDefault(); // don't refresh

    const formData = new FormData(event.currentTarget);

    let data = await handleCreateIngressForm(formData);
    setData(data);
    if (data.error) {
      setError(data.error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Create ingress</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <label htmlFor="roomId">Room id: </label>
          <input
            type="text"
            name="roomId"
            id="roomId"
            className="border-black border-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            className="border-black border-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password if needed: </label>
          <input
            type="password"
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
        <p className="text-red-500">{error}</p>
        {data.hasOwnProperty("url") && data.hasOwnProperty("password") && (
          <>
            <p className="">URL: {data["url"]}</p>
            <p className="">Password: {data["password"]}</p>
          </>
        )}
      </form>
    </>
  );
};

export default CreateIngress;
