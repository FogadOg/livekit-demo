import * as React from 'react';
import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import type { ParticipantClickEvent } from '@livekit/components-core';
import { ParticipantTile } from '@livekit/components-react';


interface LayoutProps {
  track: TrackReferenceOrPlaceholder;
}

export function CustomFocusLayout({ track: reference }: LayoutProps ) {
  return <ParticipantTile trackRef={reference} />;
}
