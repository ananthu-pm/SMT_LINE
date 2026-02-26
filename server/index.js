// ──────────────────────────────────────────────────
//  SMT Digital Twin — Socket.io Server
//  Handles BROADCAST_START / RELEASE_CONTROL events
// ──────────────────────────────────────────────────

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// ─── In-memory state ──────────────────────────────
let currentMachineId = null; // null = overview mode

// ─── Health check ─────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', currentMachineId });
});

// ─── Socket.io logic ──────────────────────────────
io.on('connection', (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Send current state to the newly-connected client
    socket.emit('SYNC_STATE', { machineId: currentMachineId });
    console.log(`  → Sent current state (machine: ${currentMachineId || 'overview'}) to ${socket.id}`);

    // Admin broadcasts a machine selection to all users
    socket.on('BROADCAST_START', (payload) => {
        const { machineId } = payload;
        if (!machineId) return;

        currentMachineId = machineId;
        console.log(`⚡ Admin BROADCAST_START → "${machineId}"`);

        // Broadcast to ALL clients
        io.emit('BROADCAST_START', { machineId });
    });

    // Admin releases control — everyone returns to overview
    socket.on('RELEASE_CONTROL', () => {
        currentMachineId = null;
        console.log(`⚡ Admin RELEASE_CONTROL → overview`);

        io.emit('RELEASE_CONTROL');
    });

    socket.on('disconnect', () => {
        console.log(`⚡ Client disconnected: ${socket.id}`);
    });
});

// ─── Start ────────────────────────────────────────
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`\n╔══════════════════════════════════════════╗`);
    console.log(`║  SMT Digital Twin Server                 ║`);
    console.log(`║  Running on http://localhost:${PORT}        ║`);
    console.log(`╚══════════════════════════════════════════╝\n`);
});
