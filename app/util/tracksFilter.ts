// /utils/tracksFilter.ts

import {
  TrackReference,
  TrackReferenceOrPlaceholder,
} from "@livekit/components-react";

type Track = TrackReference | TrackReferenceOrPlaceholder;

const tracksFilter = (tracks: Track[]) => {
  return tracks.filter(
    (track) =>
      !track.participant.isAgent &&
      !track.participant.permissions?.hidden &&
      !(track.participant.metadata === "hello")
  );
};

export default tracksFilter;
