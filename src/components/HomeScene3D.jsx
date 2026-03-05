// ──────────────────────────────────────────────────
//  HomeScene3D — Line Overview with GLB model
// ──────────────────────────────────────────────────

import React, { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import ErrorBoundary from './ErrorBoundary';
import FactoryEnvironment from '../3d/environment/FactoryEnvironment';

const OVERVIEW_MODEL = '/models/automated_pcb_assembly_line.glb';

// ─── Auto-scaled + camera-fitted GLB Model ──────
function GLBModel({ url, onModelLoaded }) {
    const { scene } = useGLTF(url);
    const { camera } = useThree();
    const groupRef = useRef();

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                // Fix white/light materials appearing as metallic grey
                if (child.material) {
                    const mat = child.material;
                    if (mat.color) {
                        const luminance = mat.color.r * 0.299 + mat.color.g * 0.587 + mat.color.b * 0.114;
                        if (luminance > 0.6) {
                            mat.metalness = 0;
                            mat.roughness = Math.max(mat.roughness, 0.6);
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

    // Normalize: fit model into a consistent bounding box and adjust camera
    const { scale, offset } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 10; // Large target size for overview (more zoomed in)
        const s = targetSize / maxDim;
        return {
            scale: [s, s, s],
            offset: [-center.x * s, -center.y * s, -center.z * s],
        };
    }, [clonedScene]);

    // Fit camera to show the full model
    useEffect(() => {
        camera.position.set(4, 2.5, 5);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
    }, [camera]);

    // Signal that model has loaded
    useEffect(() => {
        if (onModelLoaded) onModelLoaded();
    }, [onModelLoaded]);

    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.06;
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            <primitive object={clonedScene} scale={scale} position={offset} />
        </group>
    );
}

// ─── Professional 3D Loading Indicator ──────────
function LoadingIndicator3D() {
    const ringRef = useRef();
    const dotRefs = [useRef(), useRef(), useRef()];

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (ringRef.current) ringRef.current.rotation.z = t * 1.5;
        dotRefs.forEach((ref, i) => {
            if (ref.current) {
                const angle = t * 2 + (i * Math.PI * 2) / 3;
                ref.current.position.x = Math.cos(angle) * 0.8;
                ref.current.position.z = Math.sin(angle) * 0.8;
                ref.current.scale.setScalar(0.7 + Math.sin(t * 3 + i) * 0.3);
            }
        });
    });

    return (
        <group position={[0, 0.5, 0]}>
            <mesh ref={ringRef}>
                <torusGeometry args={[0.6, 0.04, 16, 48, Math.PI * 1.6]} />
                <meshStandardMaterial color="#00b4ff" emissive="#00b4ff" emissiveIntensity={0.6} transparent opacity={0.8} />
            </mesh>
            {dotRefs.map((ref, i) => (
                <mesh key={i} ref={ref}>
                    <sphereGeometry args={[0.06, 16, 16]} />
                    <meshStandardMaterial
                        color={['#00b4ff', '#6366f1', '#22c55e'][i]}
                        emissive={['#00b4ff', '#6366f1', '#22c55e'][i]}
                        emissiveIntensity={0.8}
                    />
                </mesh>
            ))}
            <Html center position={[0, -1.2, 0]}>
                <div style={{ textAlign: 'center', fontFamily: "'Orbitron', sans-serif", userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '13px', letterSpacing: '4px', color: '#00b4ff', fontWeight: 700, textTransform: 'uppercase', textShadow: '0 0 20px rgba(0,180,255,0.4)' }}>
                        Loading 3D Model
                    </div>
                    <div style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(150,160,180,0.6)', marginTop: '6px', fontFamily: "'Inter', sans-serif" }}>
                        Please wait...
                    </div>
                </div>
            </Html>
        </group>
    );
}

// ─── Scene internals ────────────────────────────
function SceneContent({ isDark, onModelLoaded }) {
    return (
        <>
            <FactoryEnvironment isDark={isDark} floorY={-0.25} />

            <Suspense fallback={<LoadingIndicator3D />}>
                <GLBModel url={OVERVIEW_MODEL} onModelLoaded={onModelLoaded} />
            </Suspense>

            <OrbitControls enableDamping dampingFactor={0.05} minDistance={3} maxDistance={20} maxPolarAngle={Math.PI / 2.1} autoRotate autoRotateSpeed={0.3} target={[0, 0, 0]} />
        </>
    );
}

// ─── Main export ────────────────────────────────
export default function HomeScene3D({ onModelLoaded }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <ErrorBoundary>
            <div className="w-full h-full">
                <Canvas
                    camera={{ position: [4, 2.5, 5], fov: 45 }}
                    shadows
                    gl={{ antialias: true, alpha: false }}
                    onCreated={({ gl }) => {
                        gl.setClearColor(isDark ? '#0c0c14' : '#f0f1f3');
                        gl.toneMapping = THREE.ACESFilmicToneMapping;
                        gl.toneMappingExposure = isDark ? 1.0 : 1.6;
                    }}
                >
                    <SceneContent isDark={isDark} onModelLoaded={onModelLoaded} />
                </Canvas>
            </div>
        </ErrorBoundary>
    );
}
