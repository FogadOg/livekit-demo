import { TrackReference } from '@livekit/components-core';
import {
  CarouselLayout,
  FocusLayout,
  ParticipantTile,
  VideoTrack,
  useVisualStableUpdate,
} from '@livekit/components-react';


interface LayoutProps {
  tracks: TrackReference[];
}

const SpeakerLayout = ({ tracks: references }: LayoutProps) => {
  const sortedTracks = useVisualStableUpdate(references, 1);
  const mainTrack = sortedTracks.shift();
  const remainingTracks = useVisualStableUpdate(sortedTracks, 3);

  if (!mainTrack) {
    return <></>;
  } else if (remainingTracks.length === 0) {
    const trackRef = mainTrack as TrackReference;
    return <VideoTrack trackRef={trackRef} />;
  }

  return (
    <div className="lk-focus-layout">
      <CarouselLayout tracks={remainingTracks}>
        <ParticipantTile className="h-full" />
      </CarouselLayout>
      <FocusLayout trackRef={mainTrack as TrackReference} />
    </div>
  );
};

export default SpeakerLayout;