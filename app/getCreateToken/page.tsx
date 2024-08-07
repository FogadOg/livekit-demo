"use client";
import { Navbar } from "../components/navbar";

export default function Page() {
  // Not secure!
  const getCreateToken = async () => {
    
    localStorage.setItem("createToken", "");
  };
  return (
    <>
      <Navbar />
      <main className="m-5">
        <h2>
          Create token is needed to be able to create rooms. You are able to
          delete your rooms
        </h2>
        <button className="btn btn-primary" onClick={getCreateToken}>
          Get ability to create room
        </button>
      </main>
    </>
  );
}
