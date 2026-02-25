// ──────────────────────────────────────────────────
//  SMT Digital Twin — Socket.io Server
//  Handles SYNC_MACHINE admin broadcasts
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
let currentMachineId = 'solder-paste-printer'; // default on startup

// ─── Health check ─────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', currentMachineId });
});

// ─── Socket.io logic ──────────────────────────────
io.on('connection', (socket) => {
    console.log(`✦ Client connected: ${socket.id}`);

    // Send the current machine to the newly-connected client
    socket.emit('SYNC_MACHINE', { machineId: currentMachineId });
    console.log(`  → Sent current machine "${currentMachineId}" to ${socket.id}`);

    // Admin broadcasts a machine change
    socket.on('SYNC_MACHINE', (payload) => {
        const { machineId } = payload;
        if (!machineId) return;

        currentMachineId = machineId;
        console.log(`✦ Admin broadcast: machine → "${machineId}"`);

        // Broadcast to ALL clients (including the admin, so their preview updates)
        io.emit('SYNC_MACHINE', { machineId });
    });

    // Machine status update (for future use — admin can toggle run/idle/error)
    socket.on('UPDATE_STATUS', (payload) => {
        const { machineId, status } = payload;
        console.log(`✦ Status update: ${machineId} → ${status}`);
        io.emit('UPDATE_STATUS', { machineId, status });
    });

    socket.on('disconnect', () => {
        console.log(`✦ Client disconnected: ${socket.id}`);
    });
});

// ─── Start ────────────────────────────────────────
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`\n╔══════════════════════════════════════════╗`);
    console.log(`║  SMT Digital Twin Server                 ║`);
    console.log(`║  Running on http://10.31.184.56:${PORT}     ║`);
    console.log(`╚══════════════════════════════════════════╝\n`);
});
