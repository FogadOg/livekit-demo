import {
    useTracks,
    useTrackTranscription,
    TrackReferenceOrPlaceholder,
    useParticipants,
  } from "@livekit/components-react";
  
  import "@livekit/components-styles";
  import { RoomEvent, Track } from "livekit-client";
  import React from "react";


export const GetTranscript = (
    identity: string
  ): TrackReferenceOrPlaceholder | undefined => {
    const tracks = useTracks();
    const participants = useParticipants({
      updateOnlyOn: [RoomEvent.ParticipantMetadataChanged],
    });
    const participant = participants.find((p) => p.identity === identity);
    if (!participant) {
      return undefined;
    }
  
    let participantTrack: TrackReferenceOrPlaceholder | undefined;
    const aat = tracks.find(
      (trackRef) =>
        trackRef.publication.kind === Track.Kind.Audio &&
        trackRef.participant.identity === identity
    );
    if (aat) {
      participantTrack = aat;
    } else if (participant) {
      participantTrack = {
        participant: participant,
        source: Track.Source.Microphone,
      };
    }
    return participantTrack;
  }