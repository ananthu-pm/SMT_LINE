// ──────────────────────────────────────────────────
//  Socket.io Client Singleton
// ──────────────────────────────────────────────────

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export const socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
});

socket.on('connect', () => {
    console.log('⚡ Socket connected:', socket.id);
});

socket.on('disconnect', () => {
    console.log('⚡ Socket disconnected');
});

socket.on('connect_error', (err) => {
    console.warn('⚡ Socket connection error:', err.message);
});
