// ──────────────────────────────────────────────────
//  HomeScene3D — Line Overview with GLB model
// ──────────────────────────────────────────────────

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const OVERVIEW_MODEL = '/models/automated_pcb_assembly_line.glb';

// ─── Auto-scaled GLB Model ──────────────────────
function GLBModel({ url }) {
    const { scene } = useGLTF(url);
    const groupRef = useRef();

    // Clone so multiple instances don't conflict
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

    // Auto-fit: compute bounding box and normalize scale
    const { scale, offset } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 6; // Fit within 6 units
        const s = targetSize / maxDim;
        return {
            scale: [s, s, s],
            offset: [-center.x * s, -center.y * s + (size.y * s) / 2 - 0.2, -center.z * s],
        };
    }, [clonedScene]);

    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.06;
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
            <torusGeometry args={[0.5, 0.08, 16, 32, Math.PI * 1.5]} />
            <meshStandardMaterial color="#00b4ff" emissive="#00b4ff" emissiveIntensity={0.5} />
        </mesh>
    );
}

// ─── Main Home Scene ─────────────────────────────
export default function HomeScene3D() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [6, 4, 8], fov: 45 }}
                shadows
                gl={{ antialias: true, alpha: false }}
                onCreated={({ gl }) => {
                    gl.setClearColor(isDark ? '#0c0c14' : '#f8f9fc');
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = isDark ? 1.0 : 1.4;
                }}
            >
                <SceneContent isDark={isDark} />
            </Canvas>
        </div>
    );
}

function SceneContent({ isDark }) {
    return (
        <Suspense fallback={<LoadingIndicator />}>
            {/* Lighting */}
            <ambientLight intensity={isDark ? 0.35 : 0.7} />
            <directionalLight
                position={[8, 10, 5]}
                intensity={isDark ? 0.8 : 1.2}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            {isDark && (
                <>
                    <pointLight position={[-4, 3, -3]} intensity={0.4} color="#00b4ff" />
                    <pointLight position={[4, 2, -3]} intensity={0.2} color="#6366f1" />
                </>
            )}
            {!isDark && (
                <>
                    <pointLight position={[0, 5, 5]} intensity={0.3} color="#ffffff" />
                    <directionalLight position={[-5, 5, -5]} intensity={0.4} />
                </>
            )}

            {/* GLB Model */}
            <GLBModel url={OVERVIEW_MODEL} />

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial
                    color={isDark ? '#0e0e1a' : '#eef0f4'}
                    metalness={isDark ? 0.7 : 0.1}
                    roughness={isDark ? 0.4 : 0.8}
                />
            </mesh>

            {/* Grid */}
            <gridHelper
                args={[30, 30, isDark ? '#1a1a30' : '#d8dce4', isDark ? '#1a1a30' : '#d8dce4']}
                position={[0, -0.24, 0]}
            />

            {/* Contact shadows */}
            <ContactShadows
                position={[0, -0.24, 0]}
                opacity={isDark ? 0.5 : 0.25}
                scale={20}
                blur={2.5}
                far={5}
            />

            {/* Environment */}
            <Environment preset={isDark ? 'night' : 'studio'} />

            {/* Orbit controls */}
            <OrbitControls
                enableDamping
                dampingFactor={0.05}
                minDistance={3}
                maxDistance={20}
                maxPolarAngle={Math.PI / 2.1}
                autoRotate
                autoRotateSpeed={0.3}
            />
        </Suspense>
    );
}

// Preload the overview model
useGLTF.preload(OVERVIEW_MODEL);
