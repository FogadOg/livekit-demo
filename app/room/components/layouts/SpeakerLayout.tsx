import { TrackReference } from "@livekit/components-core";
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
} from "@livekit/components-react";
import { TranscriptionButton } from "../transcription/transcriptionButton";
import Caption from "../transcription/caption";
import { CustomAudioRenderer } from "../../../components/customAudioRenderer";
import { useEffect, useState } from "react";
import { CustomGridLayout } from "./customGridLayout";
import useTracksFilter from "@/app/util/useTracksFilter";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";

interface LayoutProps {
  tracks: TrackReferenceOrPlaceholder[];
}

const SpeakerLayout = ({ tracks: references }: LayoutProps) => {
  const filteredTracks = useTracksFilter(references);
  const [remainingTracks, setRemainingTracks] = useState(filteredTracks);

  const mainTrack =
    filteredTracks.find((track) => track.participant.isSpeaking) ||
    filteredTracks[0];

  const [lastSpoken, setLastSpoken] = useState(mainTrack!);

  useEffect(() => {
    if (mainTrack) {
      setLastSpoken(mainTrack);
      setRemainingTracks(
        filteredTracks.filter(
          (track) =>
            track.participant.identity !== mainTrack.participant.identity
        )
      );
    }
  }, [filteredTracks]);

  const agentPresent = filteredTracks.length !== references.length;

  const participantPermissions = useLocalParticipantPermissions();

  const roomInfo = useRoomInfo();

  const transcriptAvailable = (() => {
    try {
      return !!JSON.parse(roomInfo.metadata || "{}").transcript;
    } catch {
      return false;
    }
  })();

  if (!lastSpoken) {
    return <CustomGridLayout />;
  } else if (remainingTracks.length === 0) {
    return <CustomGridLayout />;
  }

  return (
    <div
      className="lk-focus-layout"
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <CarouselLayout
        tracks={remainingTracks.filter(
          (track) =>
            track.participant.identity !== mainTrack?.participant.identity
        )}
      >
        <div className="relative">
          <ParticipantTile className="h-full" />
          <div className="absolute top-5 left-5">
            {transcriptAvailable && (
              <TranscriptionButton icon={<RecordVoiceOverIcon />} />
            )}
          </div>
          <div className="absolute top-[75%] origin-top left-[2%] max-w-[96%] xl:top-[80%] xl:left-[20%] xl:max-w-[65%]">
            {/* Caption visible if agent present*/}
            {agentPresent && <Caption />}
          </div>
        </div>
      </CarouselLayout>

      <div className="relative">
        <ParticipantTile
          className="h-full"
          trackRef={lastSpoken as TrackReference}
        />
        <div className="absolute top-10 left-20">
          {transcriptAvailable && (
            <TranscriptionButton
              trackRef={lastSpoken as TrackReference}
              hasButtonText={true}
            />
          )}
        </div>
        <div className="absolute top-[75%] origin-top left-[2%] max-w-[96%] xl:top-[80%] xl:left-[20%] xl:max-w-[65%]">
          {agentPresent && <Caption trackRef={lastSpoken as TrackReference} />}
        </div>
      </div>
      <CustomAudioRenderer />
    </div>
  );
};

export default SpeakerLayout;
