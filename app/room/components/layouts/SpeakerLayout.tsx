import { TrackReference } from '@livekit/components-core';
import {
  CarouselLayout,
  Chat,
  FocusLayout,
  GridLayout,
  ParticipantTile,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  useLocalParticipantPermissions,
  useRoomInfo,
  useVisualStableUpdate,
} from '@livekit/components-react';
import { TranscriptionButton } from '../transcription/transcriptionButton';
import Caption from '../transcription/caption';
import { CustomAudioRenderer } from '../../../components/customAudioRenderer';
import tracksFilter from '../../../util/tracksFilter';
import { useEffect, useState } from 'react';
import { CustomGridLayout } from './customGridLayout';


interface LayoutProps {
  tracks: TrackReferenceOrPlaceholder[];
}

const SpeakerLayout = ({ tracks: references }: LayoutProps) => {

  const filteredTracks = tracksFilter(references);
  const [remainingTracks, setRemainingTracks] = useState(filteredTracks)


  const mainTrack = filteredTracks.find((track) => track.participant.isSpeaking)

  const [lastSpoken, setLastSpoken] = useState(mainTrack!)

  useEffect(() => {
    if(mainTrack){
      setLastSpoken(mainTrack)
      setRemainingTracks(filteredTracks.filter((track) => track.participant.identity !== mainTrack.participant.identity))
    }
  }, [filteredTracks])
  

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


  if (!lastSpoken) {
    return <CustomGridLayout/>;
  } else if (remainingTracks.length === 0) {
    const trackRef = lastSpoken as TrackReference;
    return <VideoTrack trackRef={trackRef} />;
  }
  
  return (
    <div className="lk-focus-layout" style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}>
      <CarouselLayout tracks={remainingTracks.filter((track)=>track.participant.identity !== mainTrack?.participant.identity)}>
        <ParticipantTile />
      </CarouselLayout>
      <FocusLayout trackRef={lastSpoken as TrackReference} />
    </div>
  );
};

export default SpeakerLayout;