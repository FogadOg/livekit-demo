import { TrackReference } from "@livekit/components-core";
import {
  CarouselLayout,
  TrackRefContext,
  useLocalParticipantPermissions,
  useRoomInfo,
  useTracks,
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import { CustomGridLayout } from "./customGridLayout";
import useTracksFilter from "@/app/util/useTracksFilter";
import { ParticipantKind, Track } from "livekit-client";
import { CustomParticipantTile } from "./customParticipantTile";

const SpeakerLayout = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  const filteredTracks = useTracksFilter(tracks);

  const mainTrack = filteredTracks.find(
    (track) => track.participant.isSpeaking
  );

  const [lastSpoken, setLastSpoken] = useState(mainTrack || filteredTracks[0]);

  useEffect(() => {
    if (mainTrack) {
      setLastSpoken(mainTrack);
    } else if (!lastSpoken) {
      setLastSpoken(filteredTracks[0]);
    }
  }, [filteredTracks]);

  const agentPresent = tracks.some(
    (track) => track.participant.kind === ParticipantKind.AGENT
  );

  const participantPermissions = useLocalParticipantPermissions();

  const roomInfo = useRoomInfo();

  const transcriptAvailable = (() => {
    try {
      return !!JSON.parse(roomInfo.metadata || "{}").transcript;
    } catch {
      return false;
    }
  })();

  // * Should never happen
  if (!lastSpoken) {
    return <CustomGridLayout />;
  } else if (filteredTracks.length === 0) {
    return <CustomGridLayout />;
  }

  console.log("Last spoken", lastSpoken);
  return (
    <div style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}>
      <div
        className="lk-focus-layout flex"
        style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
      >
        <CarouselLayout
          tracks={filteredTracks.filter(
            (track) =>
              track.participant.identity !== lastSpoken?.participant.identity
          )}
        >
          <CustomParticipantTile
            agentPresent={agentPresent}
            transcriptAvailable={transcriptAvailable}
          />
        </CarouselLayout>

        <TrackRefContext.Provider value={lastSpoken as TrackReference}>
          <CustomParticipantTile
            agentPresent={agentPresent}
            transcriptAvailable={transcriptAvailable}
            transcriptButtonText={true}
          />
        </TrackRefContext.Provider>
      </div>
    </div>
  );
};

export default SpeakerLayout;
