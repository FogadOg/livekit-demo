// /utils/tracksFilter.ts

import {
  TrackReference,
  TrackReferenceOrPlaceholder,
  useRoomInfo,
} from "@livekit/components-react";
import { ParticipantKind } from "livekit-client";

type Track = TrackReference | TrackReferenceOrPlaceholder;

const tracksFilter = (tracks: Track[]) => {
  const filteredTracks = tracks.filter(
    (track) =>
      !track.participant.isAgent &&
      !track.participant.permissions?.hidden &&
      !(
        track.participant.kind === ParticipantKind.INGRESS &&
        !(track.participant.metadata === "Active")
      )
  );

  const room = useRoomInfo();

  try {
    if (JSON.parse(room.metadata!)["ingressOnly"]) {
      const ingressTracks = tracks.filter(
        (track) =>
          track.participant.kind === ParticipantKind.INGRESS &&
          track.participant.metadata === "Active"
      );
      return ingressTracks;
    }
  } catch {
    return filteredTracks;
  }
  return filteredTracks
};

export default tracksFilter;
