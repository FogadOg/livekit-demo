/**
 * Copyright 2023 LiveKit, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Chat,
  GridLayout,
  LayoutContextProvider,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useRoomContext,
  useTracks,
} from "@livekit/components-react";
import EgressHelper from "@livekit/egress-sdk";
import { ConnectionState, RoomEvent, Track } from "livekit-client";
import { ReactElement, useEffect, useState } from "react";
import SingleSpeakerLayout from "./SingleSpeakerLayout";

import SpeakerLayout from "./SpeakerLayout";
import React from "react";
import useTracksFilter from "../util/useTracksFilter";
interface RoomPageProps {
  url: string;
  token: string;
  layout: string;
}

export default function EgressRoom({ url, token, layout }: RoomPageProps) {
  const [error, setError] = useState<Error>();
  if (!url || !token) {
    return <div className="error">missing required params url and token</div>;
  }

  return (
    <LiveKitRoom serverUrl={url} token={token} onError={setError}>
      {error ? (
        <div className="error">{error.message}</div>
      ) : (
        <CompositeTemplate layout={layout} />
      )}
    </LiveKitRoom>
  );
}

interface CompositeTemplateProps {
  layout: string;
}

function CompositeTemplate({ layout: initialLayout }: CompositeTemplateProps) {
  const room = useRoomContext();
  const [layout, setLayout] = useState(initialLayout);
  const [hasScreenShare, setHasScreenShare] = useState(false);
  const screenShareTracks = useTracks([Track.Source.ScreenShare], {
    onlySubscribed: true,
  });

  useEffect(() => {
    if (room) {
      EgressHelper.setRoom(room);

      // Egress layout can change on the fly, we can react to the new layout
      // here.
      EgressHelper.onLayoutChanged((newLayout) => {
        setLayout(newLayout);
      });

      // start recording when there's already a track published
      let hasTrack = false;
      for (const p of Array.from(room.remoteParticipants.values())) {
        if (p.trackPublications.size > 0) {
          hasTrack = true;
          break;
        }
      }

      const handleTrackSubscribed = () => {
        EgressHelper.startRecording();
      };

      if (hasTrack) {
        EgressHelper.startRecording();
      } else {
        room.once(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      }
      return () => {
        room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      };
    }
  }, [room]);

  useEffect(() => {
    if (screenShareTracks.length > 0 && screenShareTracks[0].publication) {
      setHasScreenShare(true);
    } else {
      setHasScreenShare(false);
    }
  }, [screenShareTracks]);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    {
      onlySubscribed: true,
    }
  );
  const filteredTracks = useTracksFilter(tracks);
  let interfaceStyle = "dark";
  if (layout.endsWith("-light")) {
    interfaceStyle = "light";
  }

  let containerClass = "roomContainer";
  if (interfaceStyle) {
    containerClass += ` ${interfaceStyle}`;
  }

  // determine layout to use
  let main: ReactElement = <></>;
  let effectiveLayout = layout;
  if (hasScreenShare && layout.startsWith("grid")) {
    effectiveLayout = layout.replace("grid", "speaker");
  }
  if (room.state !== ConnectionState.Disconnected) {
    if (effectiveLayout.startsWith("speaker")) {
      main = <SpeakerLayout tracks={filteredTracks} />;
    } else if (effectiveLayout.startsWith("single-speaker")) {
      main = <SingleSpeakerLayout tracks={filteredTracks} />;
    } else {
      main = (
        <GridLayout tracks={filteredTracks}>
          <ParticipantTile />
        </GridLayout>
      );
    }
  }
  // !w-[100vw] is ugly workaround, can't custom size
  return (
    <div className={containerClass + " !w-[100vw]"}>
      <LayoutContextProvider>
        <div className="flex h-screen">
          {main}
          {
            //<Chat />
          }
        </div>
        <RoomAudioRenderer />
      </LayoutContextProvider>
    </div>
  );
}
