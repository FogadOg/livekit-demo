import { useRoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import { useState } from "react";
import { AddReaction } from "./addReaction";

export function ReactionHandler() {
  const decoder = new TextDecoder();
  const room = useRoomContext();

  room.on(RoomEvent.DataReceived, (payload, participant, kind) => {
    const strData = decoder.decode(payload);
    addReaction(strData);
  });

  const addReaction = (reaction: string) => {
    const id = Date.now();

    setReactions((oldList) => [...oldList, { id, reaction }]);

    setTimeout(() => {
      setReactions((prevReactions) => prevReactions.filter((r) => r.id !== id));
    }, 4000);
  };
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
