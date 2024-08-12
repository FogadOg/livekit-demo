import { useRoomInfo } from "@livekit/components-react";
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
    if (roomInfo.metadata !== "") {
      const allTranscriptions = JSON.parse(roomInfo.metadata!)["transcript"];
      const participantTranscription =
        JSON.parse(allTranscriptions)[participant.identity];
      if (participantTranscription) {
        setTranscript(participantTranscription);
      } else {
        setTranscript(`${participant.identity} hasn't spoken yet`);
      }
    }
  }, [roomInfo]);
  console.log(roomInfo);

  return (
    <div className="flex flex-col gap-16 h-full ">
      <div className="flex-1">
        {/* Transcript starting with undefined, removing that. */}
        <p>{transcript.replace("undefined", "")}</p>
      </div>
    </div>
  );
};
