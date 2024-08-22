import { useRoomContext } from "@livekit/components-react";
import { DataPacket_Kind, RemoteParticipant, RoomEvent } from "livekit-client";
import { useEffect, useState } from "react";
import { AddReaction } from "./addReaction";

export function ReactionHandler() {
  const decoder = new TextDecoder();
  const room = useRoomContext();

  const addReaction = (reaction: string, identity: string) => {
    const id = Date.now();
    if (identity.startsWith("hidden user")) {
      identity = "";
    }
    setReactions((oldList) => [
      ...oldList,
      { id, reaction, participantId: identity },
    ]);

    setTimeout(() => {
      setReactions((prevReactions) => prevReactions.filter((r) => r.id !== id));
    }, 4000);
  };

  useEffect(() => {
    const handleDataReceived = (
      payload: Uint8Array,
      participant: RemoteParticipant | undefined,
      kind: DataPacket_Kind | undefined,
      topic?: string | undefined
    ) => {
      if (topic && topic == "EmojiReaction") {
        const strData = decoder.decode(payload);
      }
    };
    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  });

  const [reactions, setReactions] = useState<
    { id: number; reaction: string; participantId: string }[]
  >([]);

  return (
    <div className="relative">
      <div className="fixed left-5 bottom-20">
        {reactions.map((reaction) => (
          <div
            key={reaction.id}
            className="animate-up-fade absolute flex items-center gap-2"
          >
            <p className="text-4xl">{reaction.reaction}</p>
            <p className="bg-base-200 px-2 rounded-xl">
              {reaction.participantId}
            </p>
          </div>
        ))}
      </div>
      <AddReaction addReaction={addReaction} />
    </div>
  );
}
