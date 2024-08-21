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
  useTracks,
  useVisualStableUpdate,
} from "@livekit/components-react";
import { TranscriptionButton } from "../transcription/transcriptionButton";
import Caption from "../transcription/caption";
import { CustomAudioRenderer } from "../../../components/customAudioRenderer";
import { useEffect, useState } from "react";
import { CustomGridLayout } from "./customGridLayout";
import useTracksFilter from "@/app/util/useTracksFilter";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import { ParticipantKind, Track } from "livekit-client";

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

  return (
    <div
      className="lk-focus-layout"
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <CarouselLayout
        tracks={filteredTracks.filter(
          (track) =>
            track.participant.identity !== lastSpoken?.participant.identity
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
