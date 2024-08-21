import { TrackReference } from "@livekit/components-core";
import {
  CarouselLayout,
  TrackRefContext,
  TrackReferenceOrPlaceholder,
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import { CustomGridLayout } from "./customGridLayout";
import { CustomParticipantTile } from "./customParticipantTile";

interface customLayoutProps {
  tracks: TrackReferenceOrPlaceholder[];
  agentPresent: boolean;
  transcriptAvailable: boolean;
}
const CustomSpeakerLayout = ({
  tracks,
  agentPresent,
  transcriptAvailable,
}: customLayoutProps) => {
  const mainTrack = tracks.find((track) => track.participant.isSpeaking);

  const [lastSpoken, setLastSpoken] = useState(mainTrack || tracks[0]);

  useEffect(() => {
    if (mainTrack) {
      setLastSpoken(mainTrack);
    } else if (!lastSpoken) {
      setLastSpoken(tracks[0]);
    }
  }, [tracks]);

  if (!lastSpoken || tracks.length === 0) {
    return (
      <CustomGridLayout
        tracks={tracks}
        transcriptAvailable={transcriptAvailable}
        agentPresent={agentPresent}
      />
    );
  }

  return (
    <div style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}>
      <div
        className="lk-focus-layout flex"
        style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
      >
        <CarouselLayout
          tracks={tracks.filter(
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

export default CustomSpeakerLayout;
