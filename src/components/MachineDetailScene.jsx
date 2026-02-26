// ──────────────────────────────────────────────────
//  MachineDetailScene — Loads per-machine GLB models
// ──────────────────────────────────────────────────

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import ErrorBoundary from './ErrorBoundary';

// ─── Auto-scaled GLB Model ──────────────────────
function MachineGLB({ url }) {
    const { scene } = useGLTF(url);
    const groupRef = useRef();

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        return clone;
    }, [scene]);

    const { scale, offset } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 4;
        const s = targetSize / maxDim;
        return {
            scale: [s, s, s],
            offset: [-center.x * s, -center.y * s + (size.y * s) / 2 - 0.6, -center.z * s],
        };
    }, [clonedScene]);

    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
    });

    return (
        <group ref={groupRef}>
            <primitive object={clonedScene} scale={scale} position={offset} />
        </group>
    );
}

// ─── Professional 3D Loading Indicator ──────────
function LoadingIndicator3D({ machineName, color = '#00b4ff' }) {
    const ringRef = useRef();
    const dotRefs = [useRef(), useRef(), useRef()];

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (ringRef.current) ringRef.current.rotation.z = t * 1.5;
        dotRefs.forEach((ref, i) => {
            if (ref.current) {
                const angle = t * 2 + (i * Math.PI * 2) / 3;
                ref.current.position.x = Math.cos(angle) * 0.7;
                ref.current.position.z = Math.sin(angle) * 0.7;
                ref.current.scale.setScalar(0.7 + Math.sin(t * 3 + i) * 0.3);
            }
        });
    });

    return (
        <group position={[0, 0.5, 0]}>
            {/* Spinning ring */}
            <mesh ref={ringRef}>
                <torusGeometry args={[0.5, 0.035, 16, 48, Math.PI * 1.6]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.8} />
            </mesh>

            {/* Orbiting dots */}
            {dotRefs.map((ref, i) => (
                <mesh key={i} ref={ref}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshStandardMaterial
                        color={[color, '#6366f1', '#22c55e'][i]}
                        emissive={[color, '#6366f1', '#22c55e'][i]}
                        emissiveIntensity={0.8}
                    />
                </mesh>
            ))}

            {/* HTML loading text */}
            <Html center position={[0, -1.0, 0]}>
                <div style={{
                    textAlign: 'center',
                    fontFamily: "'Orbitron', sans-serif",
                    userSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                }}>
                    <div style={{
                        fontSize: '13px',
                        letterSpacing: '4px',
                        color: color,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        textShadow: `0 0 20px ${color}66`,
                    }}>
                        Loading 3D Machine
                    </div>
                    {machineName && (
                        <div style={{
                            fontSize: '10px',
                            letterSpacing: '2px',
                            color: 'rgba(150,160,180,0.6)',
                            marginTop: '6px',
                            fontFamily: "'Inter', sans-serif",
                        }}>
                            {machineName}
                        </div>
                    )}
                </div>
            </Html>
        </group>
    );
}

// ─── Main Detail Scene ───────────────────────────
export default function MachineDetailScene({ machine }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <ErrorBoundary>
            <div className="w-full h-full">
                <Canvas
                    camera={{ position: [3.5, 2.5, 4], fov: 48 }}
                    shadows
                    gl={{ antialias: true, alpha: false }}
                    onCreated={({ gl }) => {
                        gl.setClearColor(isDark ? '#0c0c14' : '#f8f9fc');
                        gl.toneMapping = THREE.ACESFilmicToneMapping;
                        gl.toneMappingExposure = isDark ? 1.0 : 1.4;
                    }}
                >
                    <ambientLight intensity={isDark ? 0.35 : 0.7} />
                    <directionalLight position={[5, 8, 5]} intensity={isDark ? 0.8 : 1.0} castShadow shadow-mapSize={[2048, 2048]} />
                    {isDark && (
                        <>
                            <pointLight position={[-3, 3, -3]} intensity={0.3} color="#00b4ff" />
                            <pointLight position={[3, 2, -2]} intensity={0.2} color="#6366f1" />
                        </>
                    )}
                    {!isDark && <pointLight position={[0, 4, 4]} intensity={0.3} color="#ffffff" />}

                    {/* Machine GLB with loading text fallback */}
                    <Suspense fallback={<LoadingIndicator3D machineName={machine.name} color={machine.color} />}>
                        <MachineGLB url={machine.modelPath} />
                    </Suspense>

                    {/* Floor */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.68, 0]} receiveShadow>
                        <planeGeometry args={[20, 20]} />
                        <meshStandardMaterial color={isDark ? '#0e0e1a' : '#eef0f4'} metalness={isDark ? 0.7 : 0.1} roughness={isDark ? 0.4 : 0.8} />
                    </mesh>
                    <gridHelper args={[20, 20, isDark ? '#1a1a30' : '#d8dce4', isDark ? '#1a1a30' : '#d8dce4']} position={[0, -0.67, 0]} />
                    <ContactShadows position={[0, -0.67, 0]} opacity={isDark ? 0.5 : 0.2} scale={12} blur={2.5} far={4} />
                    <Environment preset={isDark ? 'night' : 'studio'} />
                    <OrbitControls enableDamping dampingFactor={0.05} minDistance={2} maxDistance={12} maxPolarAngle={Math.PI / 2.1} />
                </Canvas>
            </div>
        </ErrorBoundary>
    );
}
