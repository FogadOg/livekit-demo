"use client";
import { Room } from "@prisma/client";
import { useRouter } from "next/navigation";

interface JoinRoomButtonProps {
  room: Room;
}

const JoinRoomButton = ({ room }: JoinRoomButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    let username = prompt("User name?");
    router.push(`/room?roomId=${room.id}&username=${username}`);
  };

  return <button onClick={handleClick}>{room.name}</button>;
};

export default JoinRoomButton;
