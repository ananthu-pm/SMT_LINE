// ──────────────────────────────────────────────────
//  MachineModel — Procedural 3D geometry per machine type
// ──────────────────────────────────────────────────

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STATUS_COLORS = {
    running: '#39ff14',
    idle: '#f0e130',
    error: '#ff3131',
};

// ─── Solder Paste Printer ─────────────────────────
function SolderPastePrinter({ status }) {
    const groupRef = useRef();
    const color = STATUS_COLORS[status] || STATUS_COLORS.idle;

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Base platform */}
            <mesh position={[0, -0.5, 0]}>
                <boxGeometry args={[3, 0.3, 2]} />
                <meshStandardMaterial color="#2a2a3a" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Machine body */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[2.8, 1.2, 1.8]} />
                <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Squeegee rail */}
            <mesh position={[0, 1.0, 0]}>
                <boxGeometry args={[2.5, 0.1, 0.15]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Stencil frame */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[2.2, 0.05, 1.4]} />
                <meshStandardMaterial color="#3a3a4a" metalness={0.7} roughness={0.2} transparent opacity={0.7} />
            </mesh>
            {/* Side pillars */}
            {[-1.2, 1.2].map((x, i) => (
                <mesh key={i} position={[x, 0.6, 0]}>
                    <cylinderGeometry args={[0.08, 0.08, 1.4, 8]} />
                    <meshStandardMaterial color="#4a4a5a" metalness={0.8} roughness={0.2} />
                </mesh>
            ))}
        </group>
    );
}

// ─── SPI (Solder Paste Inspection) ────────────────
function SPIMachine({ status }) {
    const groupRef = useRef();
    const color = STATUS_COLORS[status] || STATUS_COLORS.idle;

    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.1;
    });

    return (
        <group ref={groupRef}>
            {/* Base */}
            <mesh position={[0, -0.5, 0]}>
                <boxGeometry args={[2.5, 0.3, 2]} />
                <meshStandardMaterial color="#2a2a3a" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Camera housing */}
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[1.5, 1, 1.5]} />
                <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Lens */}
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.4, 0.5, 0.3, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Scan beam indicator */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.8, 0.02]} />
                <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
            {/* PCB on conveyor */}
            <mesh position={[0, -0.25, 0]}>
                <boxGeometry args={[1.6, 0.05, 1.2]} />
                <meshStandardMaterial color="#0a5a0a" metalness={0.3} roughness={0.7} />
            </mesh>
        </group>
    );
}

// ─── Pick & Place ─────────────────────────────────
function PickAndPlace({ status }) {
    const groupRef = useRef();
    const headRef = useRef();
    const color = STATUS_COLORS[status] || STATUS_COLORS.idle;

    useFrame((state, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.1;
        if (headRef.current) {
            headRef.current.position.x = Math.sin(state.clock.elapsedTime * 2) * 0.8;
            headRef.current.position.z = Math.cos(state.clock.elapsedTime * 1.5) * 0.5;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Base */}
            <mesh position={[0, -0.5, 0]}>
                <boxGeometry args={[3.5, 0.3, 2.5]} />
                <meshStandardMaterial color="#2a2a3a" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Machine frame */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[3.2, 0.8, 2.2]} />
                <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Gantry rails */}
            {[-1, 1].map((z, i) => (
                <mesh key={i} position={[0, 1.2, z * 0.9]}>
                    <boxGeometry args={[3, 0.08, 0.08]} />
                    <meshStandardMaterial color="#5a5a6a" metalness={0.9} roughness={0.1} />
                </mesh>
            ))}
            {/* Pick head */}
            <group ref={headRef} position={[0, 1.0, 0]}>
                <mesh>
                    <cylinderGeometry args={[0.15, 0.08, 0.5, 12]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
                </mesh>
            </group>
            {/* Feeder bank */}
            <mesh position={[1.8, 0.2, 0]}>
                <boxGeometry args={[0.4, 0.6, 2]} />
                <meshStandardMaterial color="#3a3a4a" metalness={0.7} roughness={0.3} />
            </mesh>
        </group>
    );
}

// ─── Reflow Oven ──────────────────────────────────
function ReflowOven({ status }) {
    const groupRef = useRef();
    const color = STATUS_COLORS[status] || STATUS_COLORS.idle;

    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.1;
    });

    return (
        <group ref={groupRef}>
            {/* Oven body */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[4, 1.5, 1.8]} />
                <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Heat zones (glowing strips) */}
            {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
                <mesh key={i} position={[x, 0.76, 0]}>
                    <boxGeometry args={[0.8, 0.02, 1.4]} />
                    <meshStandardMaterial
                        color={i < 2 ? '#ff6600' : i === 2 ? '#ff3131' : '#00aaff'}
                        emissive={i < 2 ? '#ff6600' : i === 2 ? '#ff3131' : '#00aaff'}
                        emissiveIntensity={0.8}
                    />
                </mesh>
            ))}
            {/* Conveyor belt */}
            <mesh position={[0, -0.3, 0]}>
                <boxGeometry args={[4.2, 0.08, 0.6]} />
                <meshStandardMaterial color="#4a4a5a" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Status indicator */}
            <mesh position={[2.1, 0.5, 0.95]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
            </mesh>
            {/* Exhaust */}
            <mesh position={[0, 1.0, -0.8]}>
                <cylinderGeometry args={[0.15, 0.2, 0.5, 8]} />
                <meshStandardMaterial color="#3a3a4a" metalness={0.7} roughness={0.3} />
            </mesh>
        </group>
    );
}

// ─── AOI (Automated Optical Inspection) ───────────
function AOIMachine({ status }) {
    const groupRef = useRef();
    const scanRef = useRef();
    const color = STATUS_COLORS[status] || STATUS_COLORS.idle;

    useFrame((state, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.1;
        if (scanRef.current) {
            scanRef.current.position.x = Math.sin(state.clock.elapsedTime * 3) * 1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Base */}
            <mesh position={[0, -0.5, 0]}>
                <boxGeometry args={[3, 0.3, 2.2]} />
                <meshStandardMaterial color="#2a2a3a" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Camera tower */}
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[1.2, 1.8, 1.2]} />
                <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Camera array */}
            {[-0.3, 0, 0.3].map((x, i) => (
                <mesh key={i} position={[x, 0.1, 0.65]}>
                    <cylinderGeometry args={[0.08, 0.1, 0.15, 12]} rotation={[Math.PI / 2, 0, 0]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.9} roughness={0.1} />
                </mesh>
            ))}
            {/* Scan line */}
            <group ref={scanRef}>
                <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.02, 1.8]} />
                    <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
                </mesh>
            </group>
            {/* PCB */}
            <mesh position={[0, -0.28, 0]}>
                <boxGeometry args={[1.8, 0.05, 1.4]} />
                <meshStandardMaterial color="#0a5a0a" metalness={0.3} roughness={0.7} />
            </mesh>
        </group>
    );
}

// ─── Model selector ───────────────────────────────
export default function MachineModel({ type, status = 'running' }) {
    const models = {
        'solder-paste-printer': SolderPastePrinter,
        'spi': SPIMachine,
        'pick-and-place': PickAndPlace,
        'reflow-oven': ReflowOven,
        'aoi': AOIMachine,
    };

    const ModelComponent = models[type] || SolderPastePrinter;
    return <ModelComponent status={status} />;
}
