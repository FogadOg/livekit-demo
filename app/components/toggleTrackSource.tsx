import { Participant } from "livekit-client";
import { TrackSource } from "livekit-server-sdk";

const trackSourceValues = Object.values(TrackSource).filter(
  (value) => typeof value !== "number" && value !== "UNKNOWN"
);

export function ToggleTrackSource({
  trackSource,
  p,
  updateTrackSources,
}: {
  trackSource: TrackSource;
  p: Participant;
  updateTrackSources: (
    newSourceList: TrackSource[],
    p: Participant
  ) => Promise<void>;
}) {
  return (
    <p className="">
      <button
        onClick={async () => {
          const newSourceList = new Set(p.permissions?.canPublishSources);

          if (newSourceList.has(trackSource)) {
            // Remove Source from permission if it exists
            newSourceList.delete(trackSource);
          } else {
            // Add Source to permissions
            newSourceList.add(trackSource);
          }
          updateTrackSources(Array.from(newSourceList), p);
        }}
      >
        {trackSourceValues[trackSource - 1]}
      </button>
    </p>
  );
}
