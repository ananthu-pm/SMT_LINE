// ──────────────────────────────────────────────────
//  Zustand Store — Machine State & Sync
// ──────────────────────────────────────────────────

import { create } from 'zustand';
import { machines } from '../data/machines';
import { socket } from '../socket/socket';

const useMachineStore = create((set, get) => ({
    // ─── State ──────────────────────────────
    machines: machines,
    activeMachineId: 'solder-paste-printer',
    isConnected: false,

    // ─── Actions ────────────────────────────
    setActiveMachine: (id) => {
        set({ activeMachineId: id });
    },

    // Admin broadcasts a machine selection to all users
    broadcastMachine: (id) => {
        set({ activeMachineId: id });
        socket.emit('SYNC_MACHINE', { machineId: id });
    },

    // Update a specific machine's status
    updateMachineStatus: (machineId, status) => {
        set((state) => ({
            machines: state.machines.map((m) =>
                m.id === machineId ? { ...m, status } : m
            ),
        }));
        socket.emit('UPDATE_STATUS', { machineId, status });
    },

    setConnected: (connected) => {
        set({ isConnected: connected });
    },

    // ─── Computed ───────────────────────────
    getActiveMachine: () => {
        const { machines, activeMachineId } = get();
        return machines.find((m) => m.id === activeMachineId) || machines[0];
    },
}));

// ─── Socket listeners (run once on import) ───────
socket.on('connect', () => {
    useMachineStore.getState().setConnected(true);
});

socket.on('disconnect', () => {
    useMachineStore.getState().setConnected(false);
});

socket.on('SYNC_MACHINE', ({ machineId }) => {
    useMachineStore.getState().setActiveMachine(machineId);
});

socket.on('UPDATE_STATUS', ({ machineId, status }) => {
    useMachineStore.setState((state) => ({
        machines: state.machines.map((m) =>
            m.id === machineId ? { ...m, status } : m
        ),
    }));
});

export default useMachineStore;
