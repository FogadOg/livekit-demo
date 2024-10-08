import { generatePermissionToken } from "@/app/actions/adminActions";
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

    let permissionsToUse = { ...permissions };
    if (permissions.hidden) {
      permissionsToUse = { ...permissionsToUse, canPublishSources: [] };
    }
    const tokenUrl = async () => {
      const permissionToken = await generatePermissionToken(
        roomInfo.name,
        permissionsToUse,
        token
      );
      setUrl(`${baseUrl}?permissionsToken=${permissionToken}`);
    };
    tokenUrl();
  }, [permissions, roomInfo, token]);

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
              defaultChecked={permissions.canPublishData}
              onChange={handlePermissionChange}
            />
          </label>
        </li>

        <li className="flex">
          <label className="flex justify-between" htmlFor="visible">
            Visible
            <input
              type="radio"
              name="hidden"
              className="radio toggle-success"
              id="visible"
              defaultChecked={!permissions.hidden}
              onChange={() => {
                setPermissions((prev) => ({ ...prev, hidden: false }));
              }}
            />
          </label>

          <label className="flex justify-between" htmlFor="hidden">
            Hidden
            <input
              type="radio"
              name="hidden"
              className="radio toggle-success"
              id="hidden"
              defaultChecked={permissions.hidden}
              onChange={() => {
                setPermissions((prev) => ({ ...prev, hidden: true }));
              }}
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
                defaultChecked={
                  permissions.canPublishSources?.includes(
                    (index + 1) as TrackSource
                  ) && !permissions.hidden
                }
                disabled={permissions.hidden}
                onChange={() => handleSourceChange((index + 1) as TrackSource)}
              />
            </label>
          </li>
        ))}
      </form>
      <p>PS: Link will expire in 5 minutes after you copy</p>
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
