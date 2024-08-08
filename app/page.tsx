"use client";

import CreateRoom from "./room/components/room/createRoom";
import CreateIngress from "./room/createIngress";
import { Navbar } from "./components/navbar";
import GetCreateTokenForm from "./getCreateTokenForm";

export default function Home() {
  if (!localStorage.getItem("createToken")) {
    return (
      <>
        <title>Livekit demo</title>
        <Navbar />
        <main className="m-2">
          <h1 className="text-2xl">
            Looks like you don't have create token &#9940;
          </h1>

          <GetCreateTokenForm />
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
            <CreateIngress />
          </div>
        </div>
      </main>
    </>
  );
}
