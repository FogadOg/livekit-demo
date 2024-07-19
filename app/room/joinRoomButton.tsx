"use client";
import { Room } from "@prisma/client";

interface JoinRoomButtonProps {
  room: Room;
}

const JoinRoomButton = ({ room }: JoinRoomButtonProps) => {
  const handleClick = () => {
    let username = prompt("User name?");

    const currentUrl = window.location.href;
    window.location.href =
      currentUrl + `/room?roomId=${room.id}&username=${username}`;
  };

  return <button onClick={handleClick}>{room.name}</button>;
};

export default JoinRoomButton;
