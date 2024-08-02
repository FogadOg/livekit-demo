import { useRoomInfo } from "@livekit/components-react";
import { useState, useEffect } from "react";

export const PermissionForm = () => {
  const [canPublish, setCanPublish] = useState(true); // default true
  const [canPublishData, setCanPublishData] = useState(true); // default true
  const [hidden, setHidden] = useState(false); // default false
  const [url, setUrl] = useState("");

  const roomInfo = useRoomInfo();
  useEffect(() => {
    const roomId = roomInfo.name; // example room ID
    const baseUrl = "http://localhost:3000/room";
    const queryParams = new URLSearchParams({
      roomId,
      canPublish: canPublish.toString(),
      canPublishData: canPublishData.toString(),
      hidden: hidden.toString(),
    });
    setUrl(`${baseUrl}?${queryParams.toString()}`);
  }, [canPublish, canPublishData, hidden, roomInfo]);

  return (
    <>
      <form className="mb-10 menu">
        <li>
          <label
            className="flex justify-between items-center"
            htmlFor="canPublish"
          >
            Can publish
            <input
              type="checkbox"
              name="canPublish"
              className="toggle toggle-success"
              id="canPublish"
              checked={canPublish}
              onChange={(e) => setCanPublish(e.target.checked)}
            />
          </label>
        </li>
        <li>
          <label
            className="flex justify-between items-center"
            htmlFor="canPublishData"
          >
            Can message
            <input
              type="checkbox"
              name="canPublishData"
              className="toggle toggle-success"
              id="canPublishData"
              checked={canPublishData}
              onChange={(e) => setCanPublishData(e.target.checked)}
            />
          </label>
        </li>
        <li>
          <label className="flex justify-between items-center" htmlFor="hidden">
            Hidden
            <input
              type="checkbox"
              name="hidden"
              className="toggle toggle-success"
              id="hidden"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
            />
          </label>
        </li>
      </form>
      <button
        className="btn btn-primary"
        onClick={() => {
          navigator.clipboard.writeText(url);
        }}
      >
        Copy link
      </button>
    </>
  );
};
