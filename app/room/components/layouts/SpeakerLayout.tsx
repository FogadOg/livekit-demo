import { TrackReferenceOrPlaceholder, getTrackReferenceId } from '@livekit/components-core';
import {
  AudioTrack as LiveKitAudioTrack,
  CarouselLayout,
  FocusLayout,
  ParticipantTile,
  useLocalParticipantPermissions,
  useRoomInfo,
  AudioTrack,
} from '@livekit/components-react';
import { TrackReference } from "@livekit/components-react";
import { TranscriptionButton } from '../transcription/transcriptionButton';
import Caption from '../transcription/caption';
import { CustomAudioRenderer } from '../../../components/customAudioRenderer';
import tracksFilter from '../../../util/tracksFilter';
import { useEffect, useState } from 'react';
import { CustomGridLayout } from './customGridLayout';
import { CustomFocusLayout } from './customFocuseLayout';

interface LayoutProps {
  tracks: TrackReferenceOrPlaceholder[];
}

const SpeakerLayout = ({ tracks: references }: LayoutProps) => {
  const filteredTracks = tracksFilter(references);
  const [remainingTracks, setRemainingTracks] = useState(filteredTracks);

  const mainTrack = filteredTracks.find((track) => track.participant.isSpeaking);

  const [lastSpoken, setLastSpoken] = useState(mainTrack!);

  useEffect(() => {
    if (mainTrack) {
      setLastSpoken(mainTrack);
      setRemainingTracks(filteredTracks.filter((track) => track.participant.identity !== mainTrack.participant.identity));
    }
  }, [filteredTracks]);

  const agentPresent = filteredTracks.length !== references.length;
  const participantPermissions = useLocalParticipantPermissions();
  const roomInfo = useRoomInfo();

  const transcriptAvailable = (() => {
    try {
      return !!JSON.parse(roomInfo.metadata || '{}').transcript;
    } catch {
      return false;
    }
  })();



  return (
    <div className="lk-focus-layout" style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <CarouselLayout tracks={remainingTracks.filter((track) => track.participant.identity !== mainTrack?.participant.identity)}>
        <div className="relative">
          <ParticipantTile className="h-full" />
          <div className="absolute top-10 left-20">
            {transcriptAvailable && <TranscriptionButton />}
          </div>
          <div className="absolute top-[75%] origin-top left-[2%] max-w-[96%] xl:top-[80%] xl:left-[20%] xl:max-w-[65%]">
            {agentPresent && <Caption />}
          </div>
        </div>
      </CarouselLayout>
      <CustomFocusLayout track={lastSpoken} />

      <CustomAudioRenderer />
    </div>
  );
};

export default SpeakerLayout;
