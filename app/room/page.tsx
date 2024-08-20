"use client";
import { Suspense } from "react";
import RoomPage from "./roomPage";

export default function Page() {
  return (
    <Suspense fallback={"loading..."}>
      <RoomPage />
    </Suspense>
  );
}
