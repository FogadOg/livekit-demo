import { GetTranscription } from "@/app/actions/transcription";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

export const TranscriptTile = ({ roomId, userName }: { roomId: number; userName: string }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      let promisedUsers = await GetTranscription(roomId);
      setUsers(promisedUsers);
    };
    fetchUsers();
  }, [roomId]);

  const filteredUser = users.find(user => user.name === userName);

  if (!filteredUser) {
    return (
      <div className="flex flex-col gap-16 h-full ">
        <div className="flex-1">
          <div>
            <h3>No transcription found for user: {userName}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 h-full ">
      <div className="flex-1">
        <div key={filteredUser.name}>
          <p>{filteredUser.id}</p>
          <h3 className="font-bold">{filteredUser.name}:</h3>
          <p>{filteredUser.transcription}</p>
        </div>
      </div>
    </div>
  );
};
