// ──────────────────────────────────────────────────
//  Viewport3D — React Three Fiber canvas with scene
// ──────────────────────────────────────────────────

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import MachineModel from './MachineModel';
import GlowRing from './GlowRing';
import useMachineStore from '../store/useMachineStore';

// ─── Camera animator — smooth transition on machine change
function CameraAnimator() {
    const { camera } = useThree();
    const activeMachineId = useMachineStore((s) => s.activeMachineId);
    const prevId = useRef(activeMachineId);

    useEffect(() => {
        if (prevId.current !== activeMachineId) {
            prevId.current = activeMachineId;

            // Animate camera to a slightly different angle for visual feedback
            const targetPos = new THREE.Vector3(4, 3, 5);
            const startPos = camera.position.clone();
            const duration = 800; // ms
            const start = Date.now();

            function animate() {
                const elapsed = Date.now() - start;
                const t = Math.min(elapsed / duration, 1);
                const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad

                camera.position.lerpVectors(startPos, targetPos, ease);
                camera.lookAt(0, 0, 0);

                if (t < 1) requestAnimationFrame(animate);
            }
            animate();
        }
    }, [activeMachineId, camera]);

    return null;
}

// ─── Grid floor
function GridFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.65, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial
                color="#0a0a1a"
                metalness={0.8}
                roughness={0.4}
                transparent
                opacity={0.8}
            />
        </mesh>
    );
}

// ─── Main Viewport ────────────────────────────────
export default function Viewport3D({ className = '' }) {
    const activeMachine = useMachineStore((s) => s.getActiveMachine());

    return (
        <div className={`relative w-full h-full ${className}`}>
            <Canvas
                camera={{ position: [4, 3, 5], fov: 50 }}
                shadows
                gl={{ antialias: true, alpha: false }}
                onCreated={({ gl }) => {
                    gl.setClearColor('#07070f');
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 1.2;
                }}
            >
                <Suspense fallback={null}>
                    {/* Lighting */}
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
                    <pointLight position={[-3, 3, -3]} intensity={0.4} color="#00fff5" />
                    <pointLight position={[3, 2, -3]} intensity={0.3} color="#ff00ff" />

                    {/* Stars background */}
                    <Stars radius={50} depth={50} count={2000} factor={3} saturation={0.5} />

                    {/* Machine model + glow ring */}
                    <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.1}>
                        <MachineModel type={activeMachine.type} status={activeMachine.status} />
                        <GlowRing status={activeMachine.status} />
                    </Float>

                    {/* Grid floor */}
                    <GridFloor />

                    {/* Reflections */}
                    <Environment preset="night" />

                    {/* Camera controls — user can orbit/zoom */}
                    <OrbitControls
                        enableDamping
                        dampingFactor={0.05}
                        minDistance={2}
                        maxDistance={15}
                        maxPolarAngle={Math.PI / 2 + 0.2}
                    />

                    {/* Camera animation on machine switch */}
                    <CameraAnimator />
                </Suspense>
            </Canvas>

            {/* Corner HUD — Machine name */}
            <div className="absolute top-4 left-4 pointer-events-none">
                <div className="flex items-center gap-3 animate-fade-in">
                    <div
                        className="w-3 h-3 rounded-full animate-pulse-glow"
                        style={{
                            backgroundColor:
                                activeMachine.status === 'running'
                                    ? '#39ff14'
                                    : activeMachine.status === 'idle'
                                        ? '#f0e130'
                                        : '#ff3131',
                            boxShadow: `0 0 12px ${activeMachine.status === 'running'
                                    ? '#39ff14'
                                    : activeMachine.status === 'idle'
                                        ? '#f0e130'
                                        : '#ff3131'
                                }`,
                        }}
                    />
                    <span className="font-heading text-sm text-white/70 uppercase tracking-wider">
                        {activeMachine.status}
                    </span>
                </div>
            </div>
        </div>
    );
}
