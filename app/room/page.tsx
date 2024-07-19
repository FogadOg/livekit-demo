"use client";

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const username = searchParams.get('username');

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [passwordCorrect, setPasswordCorrect] = useState(false);

  useEffect(() => {
    const fetchRoomState = async () => {
      try {
        const resp = await fetch(`/api/get-room-state?roomId=${roomId}`);
        if (!resp.ok) {
          console.error(`Error fetching room: ${resp.statusText}`);
          return;
        }
        const data = await resp.json();        
        setRoomPassword(data["password"]);
      } catch (e) {
        console.error('Fetch error:', e);
      }
    };

    const fetchToken = async () => {
      try {
        const resp = await fetch(`/api/get-participant-token?room=${roomId}&username=${username}`);
        if (!resp.ok) {
          console.error(`Error fetching token: ${resp.statusText}`);
          return;
        }
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error('Fetch error:', e);
      }
    };

    fetchPassword();
    fetchToken();
  }, [roomId, username]);

  const handlePasswordCheck = () => {
    if (password === roomPassword) {
      setPasswordCorrect(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (token === '') {
    return <div>Getting token...</div>;
  }

  if (passwordCorrect) {
    return (
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        style={{ height: '100dvh' }}
        onDisconnected={() => {
          router.replace('/');
        }}
      >
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </LiveKitRoom>
    );
  }

  return (
    <div>
      <input 
        type="password" 
        placeholder="Enter room password" 
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handlePasswordCheck}>
        Join Room
      </button>
    </div>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
