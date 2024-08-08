import { getParticipantMetadata, setParticipantMetadata } from "@/app/actions/livekit";
import { GetTranscription } from "@/app/actions/transcription";
import roomService from "@/lib/roomService";
import { useRoomInfo } from "@livekit/components-react";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

export const TranscriptTile = ({ userName }: { userName: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const roomInfo = useRoomInfo();
    

  useEffect(() => {
    const fetchUsers = async () => {
      let promisedUsers = await GetTranscription(Number(roomInfo.name!));
      setUsers(promisedUsers);
    };
    fetchUsers();
  }, []); //roomInfo

  const filteredUser = users.find((user) => user.name === userName);

  if (!filteredUser) {
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
        <div key={filteredUser.name}>
          <h3 className="font-bold">{filteredUser.name}:</h3>
          <p>{filteredUser.transcription}</p>
        </div>
      </div>
    </div>
  );
};
