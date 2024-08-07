"use client";

import { useRouter } from "next/navigation";
import {
  LayoutContextProvider,
  Chat,
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipantPermissions,
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
      <LayoutContextProvider>
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
          <RoomAudioRenderer />
          <CustomControlBar token={token} />
        </LiveKitRoom>
      </LayoutContextProvider>
    </div>
  );
};

const CustomChat = () => {
  const permissions = useLocalParticipantPermissions();
  
  return(permissions?.canPublishData && <Chat />)
};

export default RoomView;
