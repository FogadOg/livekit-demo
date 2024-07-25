import {TranscriptionTile} from "./transcriptionUtil/transcriptionTile"
import {
    useParticipants,
  } from "@livekit/components-react";
  
export const Transcript = () => {
    const participants = useParticipants();
  
    return (
      <div className="flex flex-col gap-16 h-full ">
        <div className="flex-1">
            {participants.map((participant) => {
              return (
                <div key={participant.identity}>
                  <h3>{participant.identity}:</h3>
                  <TranscriptionTile identity={participant.identity} />
                </div>
              );
            })}
        </div>
      </div>
    );
  }
  