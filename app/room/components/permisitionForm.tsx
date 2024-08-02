import { useRoomInfo } from "@livekit/components-react";
import { useState, useEffect } from "react";

export const PermissionForm = () => {
  const [canUseCamera, setCanUseCamera] = useState(true); // default true
  const [canUseMicrophone, setCanUseMicrophone] = useState(true); // default true
  const [canScreenShare, setCanScreenShare] = useState(true); // default true

  const [canPublishData, setCanPublishData] = useState(true); // default true
  const [hidden, setHidden] = useState(false); // default false
  const [url, setUrl] = useState("");

  const roomInfo = useRoomInfo();
  useEffect(() => {
    const roomId = roomInfo.name; // example room ID
    const baseUrl = "http://localhost:3000/room";
    const queryParams = new URLSearchParams({
      roomId,
      canUseCamera: canUseCamera.toString(),
      canUseMicrophone: canUseMicrophone.toString(),
      canScreenShare: canScreenShare.toString(),

      canPublishData: canPublishData.toString(),
      hidden: hidden.toString(),
    });
    setUrl(`${baseUrl}?${queryParams.toString()}`);
  }, [
    canUseCamera,
    canUseMicrophone,
    canScreenShare,
    canPublishData,
    hidden,
    roomInfo,
  ]);

  return (
    <>
      <form className="mb-10 menu">
        <li>
          <label
            className="flex justify-between items-center"
            htmlFor="canUseCamera"
          >
            Use camera
            <input
              type="checkbox"
              name="canUseCamera"
              className="toggle toggle-success"
              id="canUseCamera"
              checked={canUseCamera}
              onChange={(e) => setCanUseCamera(e.target.checked)}
            />
          </label>
        </li>

        <li>
          <label
            className="flex justify-between items-center"
            htmlFor="canUseMicrophone"
          >
            Use microphone
            <input
              type="checkbox"
              name="canUseMicrophone"
              className="toggle toggle-success"
              id="canUseMicrophone"
              checked={canUseMicrophone}
              onChange={(e) => setCanUseMicrophone(e.target.checked)}
            />
          </label>
        </li>
        <li>
          <label
            className="flex justify-between items-center"
            htmlFor="canScreenShare"
          >
            Use screen share:
            <input
              type="checkbox"
              name="canScreenShare"
              className="toggle toggle-success"
              id="canScreenShare"
              checked={canScreenShare}
              onChange={(e) => setCanScreenShare(e.target.checked)}
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
      <p>{url}</p>
    </>
  );
};
