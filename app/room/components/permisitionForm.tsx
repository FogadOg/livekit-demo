import { useRoomInfo } from "@livekit/components-react";
import { useState, useEffect } from "react";

export const PermissionForm = () => {
  const [permissions, setPermissions] = useState({
    canUseCamera: true,
    canUseMicrophone: true,
    canScreenShare: true,
    canPublishData: true,
    hidden: false,
  });

  const [url, setUrl] = useState("");

  const roomInfo = useRoomInfo();

  useEffect(() => {
    const roomId = roomInfo.name; // example room ID
    const baseUrl = "http://localhost:3000/room";
    const queryParams = new URLSearchParams({
      roomId,
      ...Object.fromEntries(
        Object.entries(permissions).map(([key, value]) => [
          key,
          value.toString(),
        ])
      ),
    });
    setUrl(`${baseUrl}?${queryParams.toString()}`);
  }, [permissions, roomInfo]);

  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));
  };

  return (
    <>
      <form className="mb-10 menu">
        {Object.entries(permissions).map(([key, value]) => (
          <li key={key}>
            <label className="flex justify-between items-center" htmlFor={key}>
              {key}
              <input
                type="checkbox"
                name={key}
                className="toggle toggle-success"
                id={key}
                checked={value}
                onChange={handlePermissionChange}
              />
            </label>
          </li>
        ))}
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
