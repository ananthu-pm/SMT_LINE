// ──────────────────────────────────────────────────
//  MachineDetailScene — Loads per-machine GLB models
// ──────────────────────────────────────────────────

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

// ─── Auto-scaled GLB Model ──────────────────────
function MachineGLB({ url }) {
    const { scene } = useGLTF(url);
    const groupRef = useRef();

    // Clone scene to avoid conflicts
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

    // Auto-fit: normalize to ~4 unit bounding box
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

// ─── Loading spinner in 3D ──────────────────────
function LoadingIndicator() {
    const meshRef = useRef();
    useFrame((_, delta) => {
        if (meshRef.current) meshRef.current.rotation.z += delta * 2;
    });
    return (
        <mesh ref={meshRef}>
            <torusGeometry args={[0.4, 0.06, 16, 32, Math.PI * 1.5]} />
            <meshStandardMaterial color="#00b4ff" emissive="#00b4ff" emissiveIntensity={0.5} />
        </mesh>
    );
}

// ─── Main Detail Scene ───────────────────────────
export default function MachineDetailScene({ machine }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
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
                <Suspense fallback={<LoadingIndicator />}>
                    {/* Lighting */}
                    <ambientLight intensity={isDark ? 0.35 : 0.7} />
                    <directionalLight
                        position={[5, 8, 5]}
                        intensity={isDark ? 0.8 : 1.0}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                        shadow-camera-far={30}
                        shadow-camera-left={-8}
                        shadow-camera-right={8}
                        shadow-camera-top={8}
                        shadow-camera-bottom={-8}
                    />
                    {isDark && (
                        <>
                            <pointLight position={[-3, 3, -3]} intensity={0.3} color="#00b4ff" />
                            <pointLight position={[3, 2, -2]} intensity={0.2} color="#6366f1" />
                        </>
                    )}
                    {!isDark && (
                        <>
                            <pointLight position={[0, 4, 4]} intensity={0.3} color="#ffffff" />
                            <directionalLight position={[-4, 4, -4]} intensity={0.3} />
                        </>
                    )}

                    {/* Machine GLB model */}
                    <MachineGLB url={machine.modelPath} />

                    {/* Floor */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.68, 0]} receiveShadow>
                        <planeGeometry args={[20, 20]} />
                        <meshStandardMaterial
                            color={isDark ? '#0e0e1a' : '#eef0f4'}
                            metalness={isDark ? 0.7 : 0.1}
                            roughness={isDark ? 0.4 : 0.8}
                        />
                    </mesh>

                    <gridHelper
                        args={[20, 20, isDark ? '#1a1a30' : '#d8dce4', isDark ? '#1a1a30' : '#d8dce4']}
                        position={[0, -0.67, 0]}
                    />

                    <ContactShadows
                        position={[0, -0.67, 0]}
                        opacity={isDark ? 0.5 : 0.2}
                        scale={12}
                        blur={2.5}
                        far={4}
                    />

                    <Environment preset={isDark ? 'night' : 'studio'} />

                    <OrbitControls
                        enableDamping
                        dampingFactor={0.05}
                        minDistance={2}
                        maxDistance={12}
                        maxPolarAngle={Math.PI / 2.1}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
