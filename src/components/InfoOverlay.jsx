// ──────────────────────────────────────────────────
//  InfoOverlay — Machine-specific data panel
// ──────────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import useMachineStore from '../store/useMachineStore';

// ─── Solder Paste Printer Panel ───────────────────
function SolderPastePrinterInfo({ params }) {
    return (
        <div className="space-y-3">
            <InfoRow label="Squeegee Pressure" value={`${params.squeegePressure} kg`} accent="cyan" />
            <InfoRow label="Print Speed" value={`${params.printSpeed} mm/s`} accent="cyan" />
            <InfoRow label="Separation Speed" value={`${params.separationSpeed} mm/s`} accent="cyan" />
            <div className="mt-3 p-3 bg-cyber-bg/60 rounded-lg border border-cyber-border">
                <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-white/50">Stencil Clean Cycle</span>
                    <span className="text-neon-cyan font-mono">
                        {params.currentCleanCount}/{params.stencilCleanCycle}
                    </span>
                </div>
                <div className="h-2 bg-cyber-bg rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full transition-all duration-500"
                        style={{ width: `${(params.currentCleanCount / params.stencilCleanCycle) * 100}%` }}
                    />
                </div>
            </div>
            <InfoRow label="Boards Processed" value={params.boardsProcessed.toLocaleString()} accent="magenta" />
        </div>
    );
}

// ─── SPI Panel ────────────────────────────────────
function SPIInfo({ params }) {
    return (
        <div className="space-y-3">
            <InfoRow label="Volume %" value={`${params.volumePercent}%`} accent="cyan" />
            <InfoRow
                label="Bridge Alerts"
                value={params.bridgeAlerts}
                accent={params.bridgeAlerts > 0 ? 'red' : 'green'}
            />
            <InfoRow label="Inspected Boards" value={params.inspectedBoards.toLocaleString()} accent="cyan" />
            <InfoRow label="Defect Rate" value={`${params.defectRate}%`} accent={params.defectRate > 1 ? 'red' : 'green'} />

            {/* Mini height map visualization */}
            <div className="mt-3 p-3 bg-cyber-bg/60 rounded-lg border border-cyber-border">
                <div className="text-xs text-white/50 mb-2">3D Height Map Preview</div>
                <div className="grid grid-cols-8 gap-[2px]">
                    {params.heightMapData.flat().map((val, i) => (
                        <div
                            key={i}
                            className="aspect-square rounded-sm"
                            style={{
                                backgroundColor: `hsl(${180 - (val - 100) * 2}, 100%, ${40 + (val - 100) * 0.3}%)`,
                                opacity: 0.8,
                            }}
                            title={`${val}μm`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Pick & Place Panel ───────────────────────────
function PickAndPlaceInfo({ params }) {
    return (
        <div className="space-y-3">
            <InfoRow label="CPH (Chips/Hour)" value={params.cph.toLocaleString()} accent="cyan" />
            <InfoRow label="Head Efficiency" value={`${params.headEfficiency}%`} accent="green" />
            <InfoRow label="Placement Accuracy" value={`±${params.placementAccuracy} mm`} accent="cyan" />

            {/* Feeder status grid */}
            <div className="mt-3 p-3 bg-cyber-bg/60 rounded-lg border border-cyber-border">
                <div className="text-xs text-white/50 mb-2">Feeder Status</div>
                <div className="space-y-1.5">
                    {params.feeders.map((f) => (
                        <div key={f.id} className="flex items-center gap-2 text-xs">
                            <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{
                                    backgroundColor:
                                        f.status === 'ok' ? '#39ff14' : f.status === 'low' ? '#f0e130' : '#ff3131',
                                    boxShadow: `0 0 6px ${f.status === 'ok' ? '#39ff14' : f.status === 'low' ? '#f0e130' : '#ff3131'
                                        }`,
                                }}
                            />
                            <span className="text-white/60 font-mono truncate flex-1">{f.id}: {f.component}</span>
                            <span className={`font-mono ${f.remaining < 200 ? 'text-neon-red' : 'text-white/40'}`}>
                                {f.remaining}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Reflow Oven Panel ────────────────────────────
function ReflowOvenInfo({ params }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // Clear
        ctx.clearRect(0, 0, w, h);

        const zones = params.zones;
        const maxTemp = 280;
        const padding = { top: 15, right: 10, bottom: 25, left: 35 };
        const plotW = w - padding.left - padding.right;
        const plotH = h - padding.top - padding.bottom;

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (plotH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();
        }

        // Temperature labels
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const temp = maxTemp - (maxTemp / 4) * i;
            const y = padding.top + (plotH / 4) * i;
            ctx.fillText(`${Math.round(temp)}°`, padding.left - 4, y + 3);
        }

        // Zone colors
        const zoneColors = ['#ff6600', '#ff6600', '#f0e130', '#f0e130', '#ff3131', '#ff3131', '#00aaff', '#00aaff'];

        // Set temperature line
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        zones.forEach((z, i) => {
            const x = padding.left + (plotW / (zones.length - 1)) * i;
            const y = padding.top + plotH - (z.setTemp / maxTemp) * plotH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Actual temperature line (glowing)
        ctx.strokeStyle = '#00fff5';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00fff5';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        zones.forEach((z, i) => {
            const x = padding.left + (plotW / (zones.length - 1)) * i;
            const y = padding.top + plotH - (z.actualTemp / maxTemp) * plotH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Data points
        zones.forEach((z, i) => {
            const x = padding.left + (plotW / (zones.length - 1)) * i;
            const y = padding.top + plotH - (z.actualTemp / maxTemp) * plotH;

            ctx.fillStyle = zoneColors[i] || '#00fff5';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();

            // Zone label
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.font = '7px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.save();
            ctx.translate(x, h - 4);
            ctx.rotate(-0.5);
            const shortName = z.name.replace('Pre-heat', 'PH').replace('Soak', 'SK').replace('Reflow', 'RF').replace('Cooling', 'CL');
            ctx.fillText(shortName, 0, 0);
            ctx.restore();
        });
    }, [params.zones]);

    return (
        <div className="space-y-3">
            <InfoRow label="Conveyor Speed" value={`${params.conveyorSpeed} m/min`} accent="cyan" />
            <InfoRow label="N₂ Purity" value={`${params.nitrogenPurity}%`} accent="green" />
            <InfoRow label="Boards Processed" value={params.boardsProcessed.toLocaleString()} accent="cyan" />

            {/* Temperature profile chart */}
            <div className="mt-3 p-3 bg-cyber-bg/60 rounded-lg border border-cyber-border">
                <div className="text-xs text-white/50 mb-2">Zone Temperature Profile</div>
                <canvas
                    ref={canvasRef}
                    width={280}
                    height={140}
                    className="w-full rounded"
                    style={{ imageRendering: 'auto' }}
                />
                <div className="flex items-center gap-4 mt-2 text-[10px]">
                    <span className="flex items-center gap-1">
                        <span className="inline-block w-3 h-[2px] bg-white/20" style={{ borderTop: '1px dashed rgba(255,255,255,0.3)' }} />
                        <span className="text-white/30">Set</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="inline-block w-3 h-[2px] bg-neon-cyan" />
                        <span className="text-white/30">Actual</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── AOI Panel ────────────────────────────────────
function AOIInfo({ params }) {
    const passRate = ((params.passCount / params.totalInspected) * 100).toFixed(1);

    return (
        <div className="space-y-3">
            <div className="flex gap-3">
                <div className="flex-1 p-3 bg-neon-green/5 border border-neon-green/20 rounded-lg text-center">
                    <div className="text-2xl font-heading text-neon-green">{params.passCount}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Pass</div>
                </div>
                <div className="flex-1 p-3 bg-neon-red/5 border border-neon-red/20 rounded-lg text-center">
                    <div className="text-2xl font-heading text-neon-red">{params.failCount}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Fail</div>
                </div>
            </div>

            <InfoRow label="Pass Rate" value={`${passRate}%`} accent={passRate > 95 ? 'green' : 'red'} />
            <InfoRow label="False Call Rate" value={`${params.falseCallRate}%`} accent="yellow" />

            {/* Defect breakdown */}
            <div className="mt-3 p-3 bg-cyber-bg/60 rounded-lg border border-cyber-border">
                <div className="text-xs text-white/50 mb-2">Defect Breakdown</div>
                <div className="space-y-1.5">
                    {[
                        ['Polarity', params.polarityDefects],
                        ['Missing', params.missingComponents],
                        ['Tombstone', params.tombstones],
                        ['Insufficient Solder', params.insufficientSolder],
                        ['Bridging', params.bridging],
                    ].map(([label, count]) => (
                        <div key={label} className="flex items-center gap-2 text-xs">
                            <span className="text-white/50 flex-1">{label}</span>
                            <span className="font-mono text-neon-red">{count}</span>
                            <div className="w-16 h-1.5 bg-cyber-bg rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-neon-red/60 rounded-full"
                                    style={{ width: `${(count / params.failCount) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Shared InfoRow component ─────────────────────
function InfoRow({ label, value, accent = 'cyan' }) {
    const accentColors = {
        cyan: 'text-neon-cyan',
        magenta: 'text-neon-magenta',
        green: 'text-neon-green',
        red: 'text-neon-red',
        yellow: 'text-neon-yellow',
    };

    return (
        <div className="flex justify-between items-center py-1.5 border-b border-cyber-border/40">
            <span className="text-xs text-white/50">{label}</span>
            <span className={`text-sm font-mono font-medium ${accentColors[accent] || accentColors.cyan}`}>
                {value}
            </span>
        </div>
    );
}

// ─── Main overlay ─────────────────────────────────
const PANELS = {
    'solder-paste-printer': SolderPastePrinterInfo,
    'spi': SPIInfo,
    'pick-and-place': PickAndPlaceInfo,
    'reflow-oven': ReflowOvenInfo,
    'aoi': AOIInfo,
};

export default function InfoOverlay() {
    const activeMachine = useMachineStore((s) => s.getActiveMachine());
    const PanelComponent = PANELS[activeMachine.type];

    return (
        <div className="absolute bottom-4 right-4 w-80 max-h-[calc(100vh-8rem)] overflow-y-auto animate-slide-in">
            <div className="bg-cyber-surface/80 backdrop-blur-xl border border-cyber-border rounded-xl p-4 shadow-glass">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyber-border">
                    <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                            backgroundColor:
                                activeMachine.status === 'running'
                                    ? '#39ff14'
                                    : activeMachine.status === 'idle'
                                        ? '#f0e130'
                                        : '#ff3131',
                            boxShadow: `0 0 8px ${activeMachine.status === 'running'
                                    ? '#39ff14'
                                    : activeMachine.status === 'idle'
                                        ? '#f0e130'
                                        : '#ff3131'
                                }`,
                        }}
                    />
                    <div>
                        <h3 className="font-heading text-sm text-white tracking-wide">{activeMachine.name}</h3>
                        <p className="text-[10px] text-white/30 mt-0.5">{activeMachine.description}</p>
                    </div>
                </div>

                {/* Machine-specific panel */}
                {PanelComponent && <PanelComponent params={activeMachine.params} />}
            </div>
        </div>
    );
}
