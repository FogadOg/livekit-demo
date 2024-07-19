"use client";
import { Room } from "@prisma/client";
import { useRouter } from "next/navigation";

import { usernameTaken } from "@/app/actions";

interface JoinRoomButtonProps {
  room: Room;
}

const JoinRoomButton = ({ room }: JoinRoomButtonProps) => {
  const router = useRouter();

  const handleClick = async () => {
    let username = prompt("User name?");
    // router.push(`/room?roomId=${room.id}&username=${username}`);
    let path = await usernameTaken(room.id.toString(), username!);
  };

  return <button onClick={handleClick}>{room.name}</button>;
};

export default JoinRoomButton;
