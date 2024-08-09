import { GetTranscription } from "@/app/actions/transcription";
import { useRoomInfo } from "@livekit/components-react";
import { useEffect, useState } from "react";

export const TranscriptTile = ({ userName }: { userName: string }) => {
  const [metadata, setMetadata] = useState<Record<string, string> | null>(null);
  const roomInfo = useRoomInfo();

  useEffect(() => {
    const fetchUsers = async () => {
      if (roomInfo.name) {
        let promisedUsers = await GetTranscription(roomInfo.name);
        setMetadata(promisedUsers);
      }
    };
    fetchUsers();
  }, [roomInfo]);

  if (metadata === null) {
    return <div>Loading...</div>;
  }

  if (!(userName in metadata)) {
    return (
      <div className="flex flex-col gap-16 h-full ">
        <div className="flex-1">
          <div>
            <h3>{userName} has no transcription</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 h-full ">
      <div className="flex-1">
        <div key={userName}>
          <h3 className="font-bold">{userName}s transcription:</h3>
          <p>{metadata[userName]}</p>
        </div>
      </div>
    </div>
  );
};
