// ──────────────────────────────────────────────────
//  MachineDetailScene — Loads per-machine GLB models
//  All models normalized to uniform display size
// ──────────────────────────────────────────────────

import React, { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import ErrorBoundary from './ErrorBoundary';
import FactoryEnvironment from '../3d/environment/FactoryEnvironment';

// ─── Uniform target: every model fits into this bounding size
const UNIFORM_SIZE = 3.5;

// ─── Camera distance based on uniform size
const CAM_DISTANCE = UNIFORM_SIZE * 2.2;
const CAM_HEIGHT = UNIFORM_SIZE * 0.9;

// ─── Auto-scaled GLB with uniform sizing ────────
function MachineGLB({ url, displayScale = 1.0, onModelLoaded }) {
    const { scene } = useGLTF(url);
    const { camera } = useThree();
    const groupRef = useRef();
    const controlsRef = useRef();

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                // Fix white/light materials appearing as metallic grey
                // ACESFilmicToneMapping + high metalness compresses whites
                if (child.material) {
                    const mat = child.material;
                    if (mat.color) {
                        const luminance = mat.color.r * 0.299 + mat.color.g * 0.587 + mat.color.b * 0.114;
                        if (luminance > 0.6) {
                            mat.metalness = 0;
                            mat.roughness = Math.max(mat.roughness, 0.6);
                            // Boost light colors towards pure white
                            mat.color.r = Math.min(mat.color.r * 1.15, 1.0);
                            mat.color.g = Math.min(mat.color.g * 1.15, 1.0);
                            mat.color.b = Math.min(mat.color.b * 1.15, 1.0);
                        }
                    }
                }
            }
        });
        return clone;
    }, [scene]);

    // Calculate uniform scale and center offset
    const { scale, offset, modelHeight } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const s = (UNIFORM_SIZE * displayScale) / maxDim;

        // Center the model at origin, sitting on the floor
        const scaledHeight = size.y * s;
        return {
            scale: [s, s, s],
            offset: [
                -center.x * s,
                -center.y * s + scaledHeight / 2 - 0.5,
                -center.z * s,
            ],
            modelHeight: scaledHeight,
        };
    }, [clonedScene]);

    // Position camera to frame the model correctly
    useEffect(() => {
        camera.position.set(CAM_DISTANCE * 0.7, CAM_HEIGHT, CAM_DISTANCE * 0.7);
        camera.lookAt(0, modelHeight * 0.3, 0);
        camera.updateProjectionMatrix();
    }, [camera, modelHeight]);

    // Signal that model has loaded
    useEffect(() => {
        if (onModelLoaded) onModelLoaded();
    }, [onModelLoaded]);

    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
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
            <mesh ref={ringRef}>
                <torusGeometry args={[0.5, 0.035, 16, 48, Math.PI * 1.6]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.8} />
            </mesh>
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
            <Html center position={[0, -1.0, 0]}>
                <div style={{ textAlign: 'center', fontFamily: "'Orbitron', sans-serif", userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '13px', letterSpacing: '4px', color: color, fontWeight: 700, textTransform: 'uppercase', textShadow: `0 0 20px ${color}66` }}>
                        Loading 3D Machine
                    </div>
                    {machineName && (
                        <div style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(150,160,180,0.6)', marginTop: '6px', fontFamily: "'Inter', sans-serif" }}>
                            {machineName}
                        </div>
                    )}
                </div>
            </Html>
        </group>
    );
}

// ─── Main Detail Scene ───────────────────────────
export default function MachineDetailScene({ machine, onModelLoaded }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <ErrorBoundary>
            <div className="w-full h-full">
                <Canvas
                    camera={{
                        position: [CAM_DISTANCE * 0.7, CAM_HEIGHT, CAM_DISTANCE * 0.7],
                        fov: 45,
                        near: 0.1,
                        far: 100,
                    }}
                    shadows
                    gl={{ antialias: true, alpha: false }}
                    onCreated={({ gl }) => {
                        gl.setClearColor(isDark ? '#0c0c14' : '#f0f1f3');
                        gl.toneMapping = THREE.ACESFilmicToneMapping;
                        gl.toneMappingExposure = isDark ? 1.0 : 1.6;
                    }}
                >
                    <FactoryEnvironment isDark={isDark} floorY={-0.55} />

                    {/* Machine GLB — uniform sizing */}
                    <Suspense fallback={<LoadingIndicator3D machineName={machine.name} color={machine.color} />}>
                        <MachineGLB url={machine.modelPath} displayScale={machine.displayScale || 1.0} onModelLoaded={onModelLoaded} />
                    </Suspense>

                    <OrbitControls
                        enableDamping dampingFactor={0.05}
                        minDistance={2} maxDistance={15}
                        maxPolarAngle={Math.PI / 2.1}
                        target={[0, 0.5, 0]}
                    />
                </Canvas>
            </div>
        </ErrorBoundary>
    );
}
