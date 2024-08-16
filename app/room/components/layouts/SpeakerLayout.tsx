import { TrackReference } from '@livekit/components-core';
import {
  CarouselLayout,
  Chat,
  FocusLayout,
  ParticipantTile,
  VideoTrack,
  useLocalParticipantPermissions,
  useRoomInfo,
  useVisualStableUpdate,
} from '@livekit/components-react';
import { TranscriptionButton } from '../transcription/transcriptionButton';
import Caption from '../transcription/caption';
import { CustomAudioRenderer } from '../../../components/customAudioRenderer';
import tracksFilter from '../../../util/tracksFilter';


interface LayoutProps {
  tracks: TrackReference[];
}

const SpeakerLayout = ({ tracks: references }: LayoutProps) => {
  const sortedTracks = useVisualStableUpdate(references, 1);
  const mainTrack = sortedTracks.shift();
  const remainingTracks = useVisualStableUpdate(sortedTracks, 3);

  const filteredTracks = tracksFilter(references);

  const agentPresent = filteredTracks.length !== references.length;

  const participantPermissions = useLocalParticipantPermissions();

  const roomInfo = useRoomInfo();

  const transcriptAvailable = (() => {
    try {
      return !!JSON.parse(roomInfo.metadata || "{}").transcript;
    } catch {
      return false;
    }
  })


  if (!mainTrack) {
    return <></>;
  } else if (remainingTracks.length === 0) {
    const trackRef = mainTrack as TrackReference;
    return <VideoTrack trackRef={trackRef} />;
  }
  
  return (
    <div>
      <div className="lk-focus-layout">
        <CarouselLayout
          tracks={remainingTracks}
          style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
        >
          <div className="relative">
            <ParticipantTile className="h-full" />
            <div className="absolute top-10 left-20">
              {transcriptAvailable && <TranscriptionButton />}
            </div>
            <div className="absolute top-[75%] origin-top left-[2%] max-w-[96%] xl:top-[80%] xl:left-[20%] xl:max-w-[65%]">
              {/* Caption visible if agent present*/}
              {agentPresent && <Caption />}
            </div>
          </div>
        </CarouselLayout>
        <FocusLayout trackRef={mainTrack as TrackReference} />

        <CustomAudioRenderer/>
        {/* Chat visible if can chat */}
      </div>
      {participantPermissions?.canPublishData && <Chat />};

    </div>
    
  );
};

export default SpeakerLayout;