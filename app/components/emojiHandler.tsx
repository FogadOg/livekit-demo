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
    setReactions((oldList) => {
      let newList = [...oldList];
      newList.push(strData);
      return newList;
    });
  });

  const [reactions, setReactions] = useState<String[]>([]);

  return (
    <div className="relative">
      <div className="fixed left-5 bottom-20">
        {reactions.map((v, index) => (
          <p key={index} className="animate-up-fade absolute text-2xl">
            {v}
          </p>
        ))}
      </div>
      <button
        className="lk-button"
        onClick={() => {
          setReactions((oldList) => {
            let newList = [...oldList];
            newList.push("😊");
            return newList;
          });
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
