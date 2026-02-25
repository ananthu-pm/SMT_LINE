// ──────────────────────────────────────────────────
//  GlowRing — Animated status ring around machines
// ──────────────────────────────────────────────────

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const STATUS_COLORS = {
    running: '#39ff14',
    idle: '#f0e130',
    error: '#ff3131',
};

export default function GlowRing({ status = 'running' }) {
    const ringRef = useRef();
    const color = STATUS_COLORS[status] || STATUS_COLORS.idle;

    useFrame((state) => {
        if (ringRef.current) {
            // Gentle pulsing effect
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 0.85;
            ringRef.current.material.emissiveIntensity = pulse;
            ringRef.current.material.opacity = pulse * 0.5 + 0.2;

            // Slow rotation
            ringRef.current.rotation.z += 0.005;
        }
    });

    return (
        <mesh ref={ringRef} position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2, 0.04, 8, 64]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.8}
                transparent
                opacity={0.6}
                metalness={0.9}
                roughness={0.1}
            />
        </mesh>
    );
}
