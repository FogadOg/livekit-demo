import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import { useState } from "react";

export function EmojiHandler() {
  const localParticipant = useLocalParticipant();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const room = useRoomContext();

  room.on(RoomEvent.DataReceived, (payload, participant, kind) => {
    const strData = decoder.decode(payload);
    // console.log(`Got message from ${participant?.identity}`);
    console.log(`Message is ${strData}`);
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
        {reactions.map((reaction, index) => (
          <p key={reaction.id} className="animate-up-fade absolute text-2xl">
            {reaction.reaction}
          </p>
        ))}
      </div>
      <button
        className="lk-button"
        onClick={() => {
          addReaction("😊");
          localParticipant.localParticipant.publishData(encoder.encode("😊"), {
            reliable: true,
            topic: "EmojiReaction",
          });
        }}
      >
        Emoji React
      </button>
    </div>
  );
}
