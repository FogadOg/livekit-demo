"use client";

import CreateRoom from "./components/admin/createRoom";
import { Navbar } from "./components/navbar";
import GetCreateTokenForm from "./getCreateTokenForm";
import AdminsRooms from "./components/admin/adminsRooms";
import useCreateToken from "./hooks/useCreateToken";

export default function Home() {
  const { gettingCreateToken, hasCreateToken } = useCreateToken();

  return (
    <>
      <Navbar />
      <main className="px-56">
        <div className="hero h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Livekit demo</h1>

              <p className="py-6">
                This is a demo to showcase the capabilities of livekit. Explore
                features down below!
              </p>
              <a role="button" className="btn btn-primary" href="#roomCreate">
                Get started
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 m-5">
          <div className="card bg-base-100 w-full shadow-lg rounded-3xl border-base-200 border-2">
            <div className="flex flex-col card-body">
              <h2 className="text-2xl font-bold card-title">Admin controls</h2>
              <p className="card-body">
                Admin controls allows you to kick, mute, and hide users. Admins can
                also start recording room and invite other users.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 w-full shadow-lg rounded-3xl border-base-200 border-2">
            <div className="flex flex-col card-body">
              <h2 className="text-2xl font-bold card-title">Transcriptions</h2>
              <p className="card-body block">
                With livekit agent feature we are able to transcribe meetings in
                realtime. Agent joins room and listen to the audio tracks and
                send them to <a className="link inline">Deepgram</a> which
                transcribes the audio.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 w-full shadow-lg rounded-3xl border-base-200 border-2">
            <div className="flex flex-col card-body">
              <h2 className="text-2xl font-bold card-title">
                Meeting recording
              </h2>
              <p className="card-body">
                Livekit-egress is a docker service that allows you to record
                livekit rooms. Admins can just click record and egress service
                will spin up headless chrome and record.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 w-full shadow-lg rounded-3xl border-base-200 border-2">
            <div className="flex flex-col card-body">
              <h2 className="text-2xl font-bold card-title">
                Streaming to meeting
              </h2>
              <p className="card-body">
                Livekit-ingress is a services that will handle streams into a
                room. Instead of joining with a browser you can stream using
                link and password.
              </p>
            </div>
          </div>
        </div>
        {gettingCreateToken && (
          <div className="w-full mt-10" id="roomCreate">
            <span className="loading loading-spinner loading-lg m-auto block"></span>
          </div>
        )}

        {!hasCreateToken && !gettingCreateToken && (
          <div
            className="flex-1 grid justify-center items-center gap-10 mb-20"
            id="roomCreate"
          >
            <div className="w-80">
              <h1 className="text-2xl">
                Looks like you don't have create token &#9940;
              </h1>
              <GetCreateTokenForm />
            </div>
          </div>
        )}

        {hasCreateToken && !gettingCreateToken && (
          <div
            className="flex-1 grid justify-center items-center gap-10 mb-20"
            id="roomCreate"
          >
            <div className="mt-5 flex gap-4">
              <CreateRoom />
            </div>
            <AdminsRooms />
          </div>
        )}
      </main>
    </>
  );
}
