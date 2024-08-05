"use client";
import { FormEvent, useState } from "react";

import { getToken } from "@/app/actions/userActions";
import { ClaimGrants } from "livekit-server-sdk";

const TokenVerifyForm = () => {
  const [answer, setAnswer] = useState<ClaimGrants>();
  const verifyToken = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // don't refresh

    const formData = new FormData(event.currentTarget);

    const input = (formData.get("roomName") as string | null) || "default room";
    setAnswer(await getToken(input));
  };
  return (
    <div className="card bg-base-100 w-80 shadow-2xl rounded-3xl">
      <form onSubmit={verifyToken} className="flex flex-col card-body">
        <h2 className="text-2xl font-bold card-title">Verify token</h2>

        <input
          type="text"
          name="token"
          id="token"
          className="input input-bordered"
          placeholder="Token"
          required
        />
        <input type="submit" value="submit" className="btn btn-primary" />
        <p>{JSON.stringify(answer)}</p>
      </form>
    </div>
  );
};

export default TokenVerifyForm;
