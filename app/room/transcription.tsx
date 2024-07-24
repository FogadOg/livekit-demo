import {
    useTracks,
    useTrackTranscription,
    TrackReferenceOrPlaceholder,
    useParticipants,
  } from "@livekit/components-react";
  
  import "@livekit/components-styles";
  import { RoomEvent, Track } from "livekit-client";
  import React from "react";




  function getTranscript(
    identity: string
  ): TrackReferenceOrPlaceholder | undefined {
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
  
  function TranscriptionTile({ identity }: { identity: string }) {
    const audioTrack = getTranscript(identity);
    if (!audioTrack) {
      return <></>;
    } else {
      return <ActualTranscription audioTrack={audioTrack} />;
    }
  }
  
  function ActualTranscription({
    audioTrack,
  }: {
    audioTrack: TrackReferenceOrPlaceholder;
  }) {
    const { segments } = useTrackTranscription(audioTrack);
  
    if (segments && segments.length > 0) {
      return <h1>{segments.at(-1)?.text}</h1>;
    } else {
      return <h1>No transcription</h1>;
    }
  }
  


  const Transcript = () => {
    const participants = useParticipants();
  
    return (
      <div className="flex flex-col gap-16 h-full ">
        <div className="flex-1">
          <p>
            {participants.map((participant) => {
              return (
                <>
                  <h1>{participant.identity}:</h1>
                  <TranscriptionTile identity={participant.identity} />
                </>
              );
            })}
          </p>
        </div>
      </div>
    );
  }
  
  export default Transcript;