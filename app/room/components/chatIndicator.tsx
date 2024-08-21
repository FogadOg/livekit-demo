import { ChatToggle } from "@livekit/components-react";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
export default function ChatIndicator() {
  return (
    <div
      className="absolute right-0 top-10 bg-base-100 pr-3 rounded-lg indicator"
      id="chatIndicator"
      role="button"
      onClick={() => {}}
    >
      {/* <span className="indicator-item badge badge-primary indicator-start"> */}
      {/* 99+ */}
      {/* </span> */}
      <ChatToggle className="!p-3">
        <ChatBubbleIcon className="scale-x-[-1]" />
      </ChatToggle>
    </div>
  );
}
