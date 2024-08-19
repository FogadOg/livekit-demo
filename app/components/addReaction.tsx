import { useLocalParticipant } from "@livekit/components-react";

import AddReactionIcon from "@mui/icons-material/AddReaction";
export function AddReaction({
  addReaction,
}: {
  addReaction: (reaction: string) => void;
}) {
  const localParticipant = useLocalParticipant();
  const encoder = new TextEncoder();
  const sendReaction = (reaction: string) => {
    addReaction(reaction);
    localParticipant.localParticipant.publishData(encoder.encode(reaction), {
      reliable: true,
      topic: "EmojiReaction",
    });
  };
  return (
    <div className="dropdown dropdown-top">
      <div tabIndex={0} role="button" className="btn lk-button font-normal">
        <AddReactionIcon />Emoji react 
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow grid grid-cols-2"
      >
        {["😊", "😂", "👍", "👎", "👏", "🎉", "😭", "😡"].map((v, i) => (
          <button
            key={i}
            className="btn lk-button !text-2xl"
            onClick={() => sendReaction(v)}
          >
            {v}
          </button>
        ))}
      </ul>
    </div>
  );
}
