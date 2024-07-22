"use client";
import { Room } from "@prisma/client";
import { useRouter } from "next/navigation";

import { checkUsernameTaken } from "@/app/actions";

interface JoinRoomButtonProps {
  room: Room;
}

const JoinRoomButton = ({ room }: JoinRoomButtonProps) => {
  const router = useRouter();

  const handleClick = async () => {
    let username = prompt("User name?");
    let usernameTaken = await checkUsernameTaken(room.id.toString(), username!);
    while (usernameTaken) {
      username = prompt("User name taken, try another one");
      usernameTaken = await checkUsernameTaken(room.id.toString(), username!);
    }

    if (username !== null) {
      router.push(`/room?roomId=${room.id}&username=${username}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-gray-300 hover:bg-gray-400 cursor-pointer rounded px-2 py-1"
    >
      Join
    </button>
  );
};

export default JoinRoomButton;
