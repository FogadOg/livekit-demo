import { generatePermissionToken } from "@/app/actions/userActions";
import { useRoomInfo } from "@livekit/components-react";
import { TrackSource, VideoGrant } from "livekit-server-sdk";
import { useState, useEffect } from "react";

const trackSourceValues = Object.values(TrackSource).filter(
  (value) => typeof value !== "number" && value !== "UNKNOWN"
);

export const InviteUsersForm = ({ token }: { token: string }) => {
  const [permissions, setPermissions] = useState<VideoGrant>({
    canPublishSources: [
      TrackSource.CAMERA,
      TrackSource.MICROPHONE,
      TrackSource.SCREEN_SHARE,
      TrackSource.SCREEN_SHARE_AUDIO,
    ],
    canPublishData: true,
    hidden: false,
  });

  const [url, setUrl] = useState("");

  const roomInfo = useRoomInfo();

  useEffect(() => {
    const baseUrl = "http://localhost:3000/room";
    const tokenUrl = async () => {
      console.log(permissions);
      const permissionToken = await generatePermissionToken(
        roomInfo.name,
        permissions,
        token
      );
      setUrl(`${baseUrl}?permissionsToken=${permissionToken}`);
    };
    tokenUrl();
  }, [permissions, roomInfo]);

  const handleSourceChange = (source: TrackSource) => {
    setPermissions((prevPermissions) => {
      const sources = new Set(prevPermissions.canPublishSources);
      if (sources.has(source)) {
        sources.delete(source);
      } else {
        sources.add(source as TrackSource);
      }
      return {
        ...prevPermissions,
        canPublishSources: Array.from(sources),
      };
    });
  };

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
        <li>
          <label
            className="flex justify-between items-center"
            htmlFor="canPublishData"
          >
            Send messages
            <input
              type="checkbox"
              name="canPublishData"
              className="toggle toggle-success"
              id="canPublishData"
              checked={permissions.canPublishData}
              onChange={handlePermissionChange}
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
              checked={permissions.hidden}
              onChange={handlePermissionChange}
            />
          </label>
        </li>

        {trackSourceValues.map((source, index) => (
          <li key={source}>
            <label
              className="flex justify-between items-center first-letter:capitalize"
              htmlFor={source.toString()}
            >
              {/* Capitlizing string */}
              {source.toString().charAt(0).toUpperCase() +
                source.toString().toLowerCase().slice(1)}
              <input
                type="checkbox"
                name={source.toString()}
                className="toggle toggle-success"
                id={source.toString()}
                checked={permissions.canPublishSources?.includes(
                  (index + 1) as TrackSource
                )}
                onChange={() => handleSourceChange((index + 1) as TrackSource)}
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
