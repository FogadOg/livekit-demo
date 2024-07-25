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
    <div className="card bg-base-100 w-80 shadow-md border">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 card-body">
        <h1 className="text-2xl font-bold">Create ingress</h1>
        <div>
          <input
            type="text"
            name="roomId"
            id="roomId"
            className="input input-bordered"
            placeholder="Room id"
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="username"
            id="username"
            className="input input-bordered"
            placeholder="Username"
            required
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            id="password"
            className="input input-bordered"
            placeholder="Password if needed"
          />
        </div>

        <div>
          <input
            type="submit"
            value="Create ingress"
            className="btn btn-primary"
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
    </div>
  );
};

export default CreateIngress;
