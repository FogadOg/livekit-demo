"use client";
import { useState } from "react";
import { getCreateToken } from "./actions/userActions";

export default function GetCreateTokenForm() {
  const [message, setMessage] = useState("");
  const handleSubmit = async () => {
    setMessage("Creating roomCreate token...");
    const createToken = await getCreateToken();

    localStorage.setItem("createToken", createToken);
    setMessage("You can now create rooms");
  };
  return (
    <>
      <div className="card bg-base-100 w-80 shadow-2xl rounded-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 card-body">
          <input
            type="text"
            name="password"
            id="password"
            className="input input-bordered"
            placeholder="Password"
            required
          />
          <input
            type="submit"
            value="Get access"
            className="btn btn-primary rounded-xl"
          />
          <p>{message}</p>
        </form>
      </div>
    </>
  );
}
