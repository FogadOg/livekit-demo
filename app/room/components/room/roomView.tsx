"use client";

import { useRouter } from "next/navigation";
import {
  LayoutContextProvider,
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { CustomControlBar } from "../../../components/customControlBar";
import { VideoConference } from "../../videoConference";

interface RoomProps {
  token: string;
}

const RoomView = ({ token }: RoomProps) => {
  const router = useRouter();

  return (
    <div className="overflow-hidden">
      <LayoutContextProvider
        onWidgetChange={(state) => {
          const chatElement = document.querySelector(".lk-chat") as HTMLElement;
          if (chatElement) {
            if (state.showChat) {
              chatElement.style.display = "none";
            } else {
              chatElement.style.display = "grid";
            }
          }
        }}
      >
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          style={{ height: "100dvh" }}
          onDisconnected={() => {
            router.replace("/");
          }}
        >
          <VideoConference />
          <CustomControlBar token={token} />
        </LiveKitRoom>
      </LayoutContextProvider>
    </div>
  );
};

export default RoomView;
