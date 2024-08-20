import { useRoomContext } from "@livekit/components-react";
import { RemoteParticipant, RoomEvent } from "livekit-client";
import { useEffect, useState } from "react";
import { AddReaction } from "./addReaction";

export function ReactionHandler() {
  const decoder = new TextDecoder();
  const room = useRoomContext();

  const addReaction = (reaction: string) => {
    const id = Date.now();

    setReactions((oldList) => [...oldList, { id, reaction }]);

    setTimeout(() => {
      setReactions((prevReactions) => prevReactions.filter((r) => r.id !== id));
    }, 4000);
  };

  useEffect(() => {
    const handleDataReceived = (
      payload: Uint8Array,
      participant: RemoteParticipant | undefined
    ) => {
      const strData = decoder.decode(payload);
      addReaction(strData);
    };
    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  });

  const [reactions, setReactions] = useState<
    { id: number; reaction: string }[]
  >([]);

  return (
    <div className="relative">
      <div className="fixed left-5 bottom-20">
        {reactions.map((reaction) => (
          <p key={reaction.id} className="animate-up-fade absolute text-4xl ">
            {reaction.reaction}
          </p>
        ))}
      </div>
      <AddReaction addReaction={addReaction} />
    </div>
  );
}
