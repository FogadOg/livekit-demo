import { generatePermissionToken } from "@/app/actions/adminActions";
import {
  useParticipants,
  useRoomContext,
  useRoomInfo,
} from "@livekit/components-react";
import { ParticipantKind } from "livekit-client";
import { TrackSource, VideoGrant } from "livekit-server-sdk";
import { useState, useEffect } from "react";
import RoomIngress from "../roomIngress";

const trackSourceValues = Object.values(TrackSource).filter(
  (value) => typeof value !== "number" && value !== "UNKNOWN"
);

export const CameraManagement = ({ token }: { token: string }) => {
  const cameras = useParticipants().filter(
    (p) => p.kind === ParticipantKind.INGRESS
  );
  const room = useRoomInfo();
  return (
    <>
      <form className="mb-10 menu">
        {cameras.map((camera, index) => (
          <li key={"camera-" + index}>
            <label
              className="flex justify-between items-center first-letter:capitalize"
              htmlFor={index.toString()}
            >
              {camera.name || camera.identity}

              <input
                type="checkbox"
                name={index.toString()}
                className="toggle toggle-success"
                id={index.toString()}
                checked={camera.metadata?.includes("Active")}
                // onChange={() => }
              />
            </label>
          </li>
        ))}
      </form>

      <RoomIngress roomName={room.name} adminToken={token} />
    </>
  );
};
