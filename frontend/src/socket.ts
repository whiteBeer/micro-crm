import {io} from 'socket.io-client';

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
    extraHeaders: { 'room-id': 'globalRoom' },
    transports: ['websocket']
});
socket.on('connect', async () => {
    console.log('socket connected');
});