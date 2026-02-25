// ──────────────────────────────────────────────────
//  Machine Profiles — Static data for 5 SMT machines
// ──────────────────────────────────────────────────

export const MACHINE_TYPES = {
    SOLDER_PASTE_PRINTER: 'solder-paste-printer',
    SPI: 'spi',
    PICK_AND_PLACE: 'pick-and-place',
    REFLOW_OVEN: 'reflow-oven',
    AOI: 'aoi',
};

export const machines = [
    {
        id: 'solder-paste-printer',
        name: 'Solder Paste Printer',
        type: MACHINE_TYPES.SOLDER_PASTE_PRINTER,
        status: 'running', // running | idle | error
        description: 'DEK Horizon iX Solder Paste Printer',
        params: {
            squeegePressure: 4.8,       // kg
            printSpeed: 45,             // mm/s
            stencilCleanCycle: 5,       // prints between cleans
            currentCleanCount: 3,
            separationSpeed: 2.5,       // mm/s
            boardsProcessed: 1247,
        },
        oee: { availability: 94.2, performance: 91.5, quality: 99.1 },
    },
    {
        id: 'spi',
        name: 'SPI (Solder Paste Inspection)',
        type: MACHINE_TYPES.SPI,
        status: 'running',
        description: 'Koh Young Zenith 3D SPI System',
        params: {
            heightMapData: [
                [120, 135, 128, 142, 110, 125, 138, 131],
                [115, 140, 132, 148, 105, 130, 135, 126],
                [125, 130, 145, 138, 118, 142, 128, 133],
                [110, 148, 136, 125, 130, 138, 140, 122],
            ],
            volumePercent: 96.3,
            bridgeAlerts: 2,
            inspectedBoards: 1242,
            defectRate: 0.4,
        },
        oee: { availability: 97.1, performance: 95.3, quality: 99.6 },
    },
    {
        id: 'pick-and-place',
        name: 'Pick & Place (High Speed)',
        type: MACHINE_TYPES.PICK_AND_PLACE,
        status: 'idle',
        description: 'Yamaha YSM40R Surface Mounter',
        params: {
            cph: 85000,                 // Chips Per Hour
            headEfficiency: 97.2,       // %
            feeders: [
                { id: 'F01', component: '0402 Resistor', status: 'ok', remaining: 4800 },
                { id: 'F02', component: '0603 Capacitor', status: 'ok', remaining: 3200 },
                { id: 'F03', component: 'SOT-23 Transistor', status: 'low', remaining: 180 },
                { id: 'F04', component: 'QFP-48 IC', status: 'ok', remaining: 520 },
                { id: 'F05', component: '0805 LED', status: 'empty', remaining: 0 },
                { id: 'F06', component: 'BGA-256', status: 'ok', remaining: 1100 },
            ],
            placementAccuracy: 0.025,   // mm
        },
        oee: { availability: 88.5, performance: 93.7, quality: 99.4 },
    },
    {
        id: 'reflow-oven',
        name: 'Reflow Oven',
        type: MACHINE_TYPES.REFLOW_OVEN,
        status: 'running',
        description: 'Heller 1913 MK5 Reflow Oven',
        params: {
            zones: [
                { name: 'Pre-heat 1', setTemp: 150, actualTemp: 148 },
                { name: 'Pre-heat 2', setTemp: 180, actualTemp: 179 },
                { name: 'Soak 1', setTemp: 200, actualTemp: 198 },
                { name: 'Soak 2', setTemp: 210, actualTemp: 211 },
                { name: 'Reflow 1', setTemp: 245, actualTemp: 243 },
                { name: 'Reflow 2', setTemp: 260, actualTemp: 258 },
                { name: 'Cooling 1', setTemp: 180, actualTemp: 182 },
                { name: 'Cooling 2', setTemp: 80, actualTemp: 83 },
            ],
            conveyorSpeed: 0.85,        // m/min
            nitrogenPurity: 99.7,       // %
            boardsProcessed: 1238,
        },
        oee: { availability: 96.8, performance: 94.1, quality: 99.7 },
    },
    {
        id: 'aoi',
        name: 'AOI (Automated Optical Inspection)',
        type: MACHINE_TYPES.AOI,
        status: 'error',
        description: 'Omron VT-S730 3D AOI System',
        params: {
            passCount: 1196,
            failCount: 42,
            totalInspected: 1238,
            polarityDefects: 8,
            missingComponents: 12,
            tombstones: 5,
            insufficientSolder: 11,
            bridging: 6,
            falseCallRate: 3.2,         // %
        },
        oee: { availability: 92.3, performance: 89.6, quality: 96.6 },
    },
];

export const getMachineById = (id) => machines.find((m) => m.id === id);
