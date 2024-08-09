import { GetTranscription } from "@/app/actions/transcription";
import {
  useLocalParticipant,
  useParticipants,
  useRoomInfo,
} from "@livekit/components-react";
import { User } from "@prisma/client";
import { Participant } from "livekit-client";
import { useEffect, useState } from "react";

export const TranscriptTile = ({
  participant,
}: {
  participant: Participant;
}) => {
  // TODO update only on metadata update
  const roomInfo = useRoomInfo();

  const [transcript, setTranscript] = useState("");
  useEffect(() => {
    const allTranscriptions = JSON.parse(roomInfo.metadata!)["transcript"];
    const participantTranscription =
      JSON.parse(allTranscriptions)[participant.identity];
    setTranscript(participantTranscription);
  }, [roomInfo]);
  console.log(roomInfo);

  return (
    <div className="flex flex-col gap-16 h-full ">
      <div className="flex-1">
        <p>{transcript.replace("undefined", "")}</p>
      </div>
    </div>
  );
};
