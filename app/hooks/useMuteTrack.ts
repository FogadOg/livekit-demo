import { useState, useEffect } from "react";
import { getIsAdmin } from "../actions/roomActions";
import { TrackReference, useRoomInfo } from "@livekit/components-react";
import { TrackEvent } from "livekit-client";
import { muteTrack } from "../actions/adminActions";

// Should update on permissions update?
export default function useMuteTrack(track?: TrackReference) {
  const [trackMuted, setTrackMuted] = useState(track?.publication.isMuted);

  const room = useRoomInfo();

  if (track) {
    track.publication.once(TrackEvent.Unmuted, () => {
      console.log("Unmuted");
      setTrackMuted(false);
    });
    track.publication.once(TrackEvent.Muted, () => {
      console.log("Muted");
      setTrackMuted(true);
    });
  }

  useEffect(() => {
    muteTrack(
      room.name,
      track?.participant.identity!,
      track?.publication.trackSid!,
      trackMuted!
    );
  }, [trackMuted]);

  return {trackMuted, setTrackMuted};
}
