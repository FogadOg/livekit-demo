"use client";

import { useState, useEffect } from "react";
import CreateRoom from "./components/admin/createRoom";
import { Navbar } from "./components/navbar";
import GetCreateTokenForm from "./getCreateTokenForm";
import AdminsRooms from "./components/admin/adminsRooms";

export default function Home() {
  const [hasCreateToken, setHasCreateToken] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const createToken = localStorage.getItem("createToken");
      setHasCreateToken(!!createToken);
    }
  }, []);

  // TODO Need loading state

  if (!hasCreateToken) {
    return (
      <>
        <title>Livekit demo</title>
        <Navbar />
        <main className="m-2 flex-1 grid justify-center items-center gap-10 ">
          <div className="w-80">
            <h1 className="text-2xl">
              Looks like you don't have create token &#9940;
            </h1>
            <GetCreateTokenForm />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <title>Livekit demo</title>
      <Navbar />
      <main className="px-16 py-5 flex">
        <div className="flex-1 grid justify-center items-center gap-10">
          <div className="mt-5 flex gap-4">
            <CreateRoom />
          </div>
          <AdminsRooms />
        </div>
      </main>
    </>
  );
}
