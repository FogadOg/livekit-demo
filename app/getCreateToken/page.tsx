"use client";
import { useState } from "react";
import { getCreateToken } from "../actions/userActions";
import { Navbar } from "../components/navbar";

export default function Page() {
  const [message, setMessage] = useState("");
  // ! Not secure
  const askForCreateToken = async () => {
    setMessage("Creating roomCreate token...");
    const createToken = await getCreateToken();

    localStorage.setItem("createToken", createToken);
    setMessage("You can now create rooms");
  };
  return (
    <>
      <Navbar />
      <main className="m-5">
        <h2>
          Create token is needed to be able to create rooms. You are able to
          delete your rooms
        </h2>
        <button className="btn btn-primary" onClick={askForCreateToken}>
          Get ability to create room
        </button>
        <p>{message}</p>
      </main>
    </>
  );
}
