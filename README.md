# Livekit demo

This is a livekit demo. This demo is to showcase the capabilities of livekit.

## Features

- **Create and Join Rooms**: Users can create public or private rooms and join existing ones.

- **Security**: Rooms can be secured with a password to ensure privacy.

- **Live Streaming**: Stream your audio and video to the room using the ingress feature.

- **Recording**: Record your meetings and sessions using the egress feature.

- **Captions and Transcripts**: View English captions in real-time and access a full transcript of the meeting.

## How to run

### Prerequisites

- Install livekit
- Livekit ingress + build and add to path
- Python packages from requirements.txt

### Next js

```bash
yarn dev
```

### Livekit server

```bash
livekit-server --config livekit-config.yaml --dev --bind 0.0.0.0
```

### Transcription agent

```bash
python3 agent.py dev
```

### Egress

```bash
sudo docker run --rm --cap-add SYS_ADMIN -e EGRESS_CONFIG_FILE=/out/config.yaml -v ~/livekit-egress:/out/   livekit/egress
```

### Ingress

```bash
ingress --config ingress-config.yaml
```
