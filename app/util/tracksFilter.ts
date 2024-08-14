// /utils/tracksFilter.ts

import {
  TrackReference,
  TrackReferenceOrPlaceholder,
} from "@livekit/components-react";
import { ParticipantKind } from "livekit-client";

type Track = TrackReference | TrackReferenceOrPlaceholder;

const tracksFilter = (tracks: Track[]) => {
  return tracks.filter(
    (track) =>
      !track.participant.isAgent &&
      !track.participant.permissions?.hidden &&
      !(
        track.participant.kind === ParticipantKind.INGRESS &&
        !(track.participant.metadata === "Active")
      )
  );
};

export default tracksFilter;
