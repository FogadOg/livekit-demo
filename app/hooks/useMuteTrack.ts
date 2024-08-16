import { useState, useEffect } from "react";
import { TrackReference, useRoomInfo } from "@livekit/components-react";
import { TrackEvent } from "livekit-client";
import { muteTrack } from "../actions/adminActions";

// Should update on permissions update?
export default function useMuteTrack(token:string,track?: TrackReference) {
  const [trackMuted, setTrackMuted] = useState(track?.publication.isMuted);

  const room = useRoomInfo();

  if (track) {
    track.publication.once(TrackEvent.Unmuted, () => {
      setTrackMuted(false);
    });
    track.publication.once(TrackEvent.Muted, () => {
      setTrackMuted(true);
    });
  }

  useEffect(() => {
    if (track) {
      muteTrack(
        room.name,
        track?.participant.identity!,
        track?.publication.trackSid!,
        trackMuted!,
        token
      );
    }
  }, [trackMuted]);

  return { trackMuted, setTrackMuted };
}
