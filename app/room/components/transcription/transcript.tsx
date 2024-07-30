import { GetTranscription } from "@/app/actions/transcription";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

export const Transcript = ({ roomId }: { roomId: number }) => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      let promisedUsers = await GetTranscription(roomId);
      setUsers(promisedUsers);
    };
    fetchUsers();
  }, []);

  if (users.length === 0) {
    return (
      <div className="flex flex-col gap-16 h-full ">
        <div className="flex-1">
          <div>
            <h3>Transcription not available, no agent</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 h-full ">
      <div className="flex-1">
        {users.map((user) => {
          return (
            <div key={user.name}>
              <h3 className="font-bold">{user.name}:</h3>
              <p>{user.transcription}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
