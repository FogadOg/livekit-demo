"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getCreateToken } from "./actions/userActions";

export default function GetCreateTokenForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Creating roomCreate token...");
    const { valid, token } = await getCreateToken(password);

    if (valid) {
      localStorage.setItem("createToken", token!);
      setMessage("You can now create rooms");
      window.location.reload();
    } else {
      setMessage("Seems the password was wrong try again");
    }
    setPassword("");
  };
  return (
    <>
      <div className="card bg-base-100 w-80 shadow-lg rounded-3xl border-base-200 border-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 card-body">
          <h2 className="text-2xl font-bold card-title">Get token</h2>
          <input
            type="password"
            name="password"
            id="password"
            className="input input-bordered"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
