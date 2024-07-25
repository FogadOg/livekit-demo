import {TranscriptionTile} from "./transcriptionUtil/transcription"
import {
    useParticipants,
  } from "@livekit/components-react";
  
const Caption = () => {
    const participants = useParticipants();
  
    return (
      <div className="flex flex-col gap-16 h-full ">
        <div className="flex-1">
          <p>
            {participants.map((participant) => {
              return (
                <>
                  <h1>{participant.identity}:</h1>
                  <TranscriptionTile identity={participant.identity} />
                </>
              );
            })}
          </p>
        </div>
      </div>
    );
  }
  
  export default Caption;