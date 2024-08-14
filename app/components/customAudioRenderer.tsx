import { getTrackReferenceId, isLocal } from "@livekit/components-core";
import { Track } from "livekit-client";
import * as React from "react";
import {
  AudioTrack,
  TrackReferenceOrPlaceholder,
  useTracks,
} from "@livekit/components-react";
import { TrackReference } from "@livekit/components-react";
import tracksFilter from "../util/tracksFilter";

/** @public */
export interface RoomAudioRendererProps {
  /** Sets the volume for all audio tracks rendered by this component. By default, the range is between `0.0` and `1.0`. */
  volume?: number;
  /**
   * If set to `true`, mutes all audio tracks rendered by the component.
   * @remarks
   * If set to `true`, the server will stop sending audio track data to the client.
   * @alpha
   */
  muted?: boolean;
}

/**
 * The `RoomAudioRenderer` component is a drop-in solution for adding audio to your LiveKit app.
 * It takes care of handling remote participants’ audio tracks and makes sure that microphones and screen share are audible.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <RoomAudioRenderer />
 * </LiveKitRoom>
 * ```
 * @public
 */
export function CustomAudioRenderer({ volume, muted }: RoomAudioRendererProps) {
  const tracks = useTracks(
    [
      Track.Source.Microphone,
      Track.Source.ScreenShareAudio,
      Track.Source.Unknown,
    ],
    {
      updateOnlyOn: [],
      onlySubscribed: true,
    }
  ).filter(
    (ref: TrackReference) =>
      !isLocal(ref.participant) && ref.publication.kind === Track.Kind.Audio
  );
  const filteredTracks = tracksFilter(tracks);

  return (
    <div style={{ display: "none" }}>
      {filteredTracks.map((trackRef) => (
        <AudioTrack
          key={getTrackReferenceId(trackRef)}
          trackRef={trackRef as TrackReference}
          volume={volume}
          muted={muted}
        />
      ))}
    </div>
  );
}
