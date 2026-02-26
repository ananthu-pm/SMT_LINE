// ──────────────────────────────────────────────────
//  Zustand Store — Machine State & Broadcast Sync
// ──────────────────────────────────────────────────

import { create } from 'zustand';
import { machines } from '../data/machines';
import { socket } from '../socket/socket';

const useMachineStore = create((set, get) => ({
    // ─── State ──────────────────────────────
    machines: machines,
    activeMachineId: null,        // null = home/overview, string = viewing machine
    isBroadcasting: false,        // is admin currently broadcasting?
    isConnected: false,

    // ─── Actions ────────────────────────────

    // Admin selects a machine to broadcast
    broadcastMachine: (id) => {
        set({ activeMachineId: id, isBroadcasting: true });
        socket.emit('BROADCAST_START', { machineId: id });
    },

    // Admin releases control — everyone goes back to overview
    releaseControl: () => {
        set({ activeMachineId: null, isBroadcasting: false });
        socket.emit('RELEASE_CONTROL');
    },

    // Called when socket receives broadcast from server
    setActiveMachine: (id) => {
        set({ activeMachineId: id, isBroadcasting: id !== null });
    },

    // Reset to overview
    resetToOverview: () => {
        set({ activeMachineId: null, isBroadcasting: false });
    },

    setConnected: (connected) => {
        set({ isConnected: connected });
    },

    // ─── Computed ───────────────────────────
    getActiveMachine: () => {
        const { machines, activeMachineId } = get();
        return machines.find((m) => m.id === activeMachineId) || null;
    },
}));

// ─── Socket listeners (run once on import) ───────
socket.on('connect', () => {
    useMachineStore.getState().setConnected(true);
});

socket.on('disconnect', () => {
    useMachineStore.getState().setConnected(false);
});

socket.on('BROADCAST_START', ({ machineId }) => {
    useMachineStore.getState().setActiveMachine(machineId);
});

socket.on('RELEASE_CONTROL', () => {
    useMachineStore.getState().resetToOverview();
});

// On initial connect, server sends current state
socket.on('SYNC_STATE', ({ machineId }) => {
    if (machineId) {
        useMachineStore.getState().setActiveMachine(machineId);
    }
});

export default useMachineStore;
