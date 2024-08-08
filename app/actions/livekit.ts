"use server"

import { ParticipantInfo, RoomServiceClient } from 'livekit-server-sdk';
import roomService from '@/lib/roomService';

const API_KEY = process.env.LIVEKIT_API_KEY!;
const API_SECRET = process.env.LIVEKIT_API_SECRET!;
const SERVER_URL = process.env.LIVEKIT_SERVER_URL!;


// Function to set room metadata
export async function setParticipantMetadata(roomName: string, userName: string, metadata: string): Promise<void> {
    roomService.updateParticipant(roomName, userName, metadata)

}
export async function getParticipantMetadata(roomName: string): Promise<ParticipantInfo[]> {
    const participants = await roomService.listParticipants(roomName)
    return participants
    
}

