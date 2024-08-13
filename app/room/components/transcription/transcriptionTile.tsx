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
    if (roomInfo.metadata) {
      try {
        const { transcript: allTranscriptions } = JSON.parse(roomInfo.metadata);
        const participantTranscription =
          JSON.parse(allTranscriptions)[participant.identity];
        setTranscript(
          participantTranscription ||
            `${participant.identity} hasn't spoken yet`
        );
      } catch (error) {
        console.error("Error parsing metadata:", error);
        setTranscript("Error retrieving transcript");
      }
    }
  }, [roomInfo]);

  return (
    <div className="flex flex-col gap-16 h-full ">
      <div className="flex-1">
        {transcript === "" ? (
          <div>No transcript</div>
        ) : (
          <>
            {/* Transcript starting with undefined, removing that. */}
            <p className="max-h-72 overflow-auto">
              {transcript.replace("undefined", "")}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
