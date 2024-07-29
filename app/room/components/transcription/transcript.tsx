import { TranscriptionTile } from "./transcriptionUtil/transcriptionTile";
import { useParticipants } from "@livekit/components-react";

export const Transcript = () => {
  const participants = useParticipants();
  const filteredParticipants =
    participants.length > 0
      ? participants.filter((participant) => !participant.isAgent)
      : participants;

  const agentPresent = participants.length !== filteredParticipants.length;
  if (!agentPresent) {
    return (
      <div className="flex flex-col gap-16 h-full ">
        <div className="flex-1">
          {filteredParticipants.map((participant) => {
            return (
              <div key={participant.identity}>
                <h3 className="font-bold">{participant.identity}:</h3>
                <p>Transcription not available</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-16 h-full ">
      <div className="flex-1">
        {filteredParticipants.map((participant) => {
          return (
            <div key={participant.identity}>
              <h3 className="font-bold">{participant.identity}:</h3>
              <TranscriptionTile identity={participant.identity} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
