"use client";

import { useState, useEffect } from "react";
import CreateRoom from "./components/admin/createRoom";
import { Navbar } from "./components/navbar";
import GetCreateTokenForm from "./getCreateTokenForm";
import AdminsRooms from "./components/admin/adminsRooms";

export default function Home() {
  const [hasCreateToken, setHasCreateToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const createToken = localStorage.getItem("createToken");
      setHasCreateToken(!!createToken);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="w-full mt-10">
          <span className="loading loading-spinner loading-lg m-auto block"></span>
        </div>
      </>
    );
  }

  if (!hasCreateToken) {
    return (
      <>
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
