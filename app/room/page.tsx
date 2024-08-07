"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import RoomView from "./components/room/roomView";
import RoomAccessForm from "./components/room/roomAccessForm";

export default function Page() {
  const searchParams = useSearchParams();

  const permissionsToken = searchParams.get("permissionsToken");
  const adminToken = searchParams.get("adminToken");

  const [token, setToken] = useState(adminToken ? adminToken : "");

  if (token !== "") {
    return <RoomView token={token} />;
  }
  if (!permissionsToken) {
    return (
      <>
        <h1 className="font-bold text-xl">No token?</h1>
        <p>You are missing token from url? Please make sure to copy full url</p>
      </>
    );
  }
  return (
    <RoomAccessForm setToken={setToken} permissionToken={permissionsToken} />
  );
}
