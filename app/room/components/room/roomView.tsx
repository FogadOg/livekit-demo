"use client";

import { useRouter } from "next/navigation";
import {
  LayoutContextProvider,
  LiveKitRoom,
  LocalUserChoices,
  PreJoin,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { CustomControlBar } from "../../../components/customControlBar";
import { VideoConference } from "../../videoConference";
import { useMemo } from "react";
import { RoomOptions } from "livekit-client";

interface RoomProps {
  token: string;
  preJoinChoices: LocalUserChoices | undefined
}

const RoomView = ({ token, preJoinChoices }: RoomProps) => {
  const router = useRouter();


  const roomOptions = useMemo((): RoomOptions => {
    if(preJoinChoices) {
      return {
        videoCaptureDefaults: {
          deviceId: preJoinChoices!.videoDeviceId ?? undefined,
        },
        audioCaptureDefaults: {
          deviceId: preJoinChoices!.audioDeviceId ?? undefined,
        },
        adaptiveStream: { pixelDensity: "screen" },
        dynacast: true,
      };

    }
    return {}
  }, [preJoinChoices]);

  return (
    <div className="overflow-hidden">
      <LayoutContextProvider
        onWidgetChange={(state) => {
          const chatElement = document.querySelector(".lk-chat") as HTMLElement;
          const chatIndicator = document.querySelector(
            "#chatIndicator"
          ) as HTMLElement;
          if (chatElement && chatIndicator) {
            chatElement.style.display = state.showChat ? "grid" : "none";
            chatIndicator.style.display = state.showChat ? "none" : "block";
          }
        }}
      >
        <LiveKitRoom
          video={preJoinChoices?.videoEnabled}
          audio={preJoinChoices?.audioEnabled}
          options={roomOptions}
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
