// ──────────────────────────────────────────────────
//  FactoryEnvironment — Realistic SMT shop floor
//  Reusable across HomeScene3D & MachineDetailScene
//
//  Structure:
//  ├── Floor
//  ├── FloorMarkings (yellow safety boundary)
//  ├── Walls
//  │   ├── BackWall  (z = -12)
//  │   ├── LeftWall  (x = -15)
//  │   ├── RightWall (x = +15)
//  │   └── FrontWallWithDoor (z = +12)
//  ├── WallScreens (TVs + L&T logo)
//  ├── ExitSign (red text above front door)
//  ├── WallSignage
//  └── Lighting
// ──────────────────────────────────────────────────

import React, { useMemo } from 'react';
import { Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ─── Constants ───────────────────────────────────
const WALL_HEIGHT = 8;
const BACK_Z = -12;
const FRONT_Z = 12;
const LEFT_X = -15;
const RIGHT_X = 15;
const WALL_WIDTH = Math.abs(LEFT_X - RIGHT_X); // 30
const WALL_DEPTH = Math.abs(BACK_Z - FRONT_Z); // 24

// ─── Yellow Safety Marking Strip ─────────────────
function SafetyStrip({ position, size }) {
    return (
        <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={false}>
            <planeGeometry args={size} />
            <meshStandardMaterial
                color="#facc15"
                roughness={0.6}
                metalness={0.0}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

// ─── Yellow Safety Boundary Markings ─────────────
function SafetyMarkings({ floorY, zoneWidth = 12, zoneDepth = 8 }) {
    const y = floorY + 0.01;
    const thickness = 0.25;
    const hw = zoneWidth / 2;
    const hd = zoneDepth / 2;

    return (
        <group>
            <SafetyStrip position={[0, y, hd]} size={[zoneWidth + thickness, thickness]} />
            <SafetyStrip position={[0, y, -hd]} size={[zoneWidth + thickness, thickness]} />
            <SafetyStrip position={[-hw, y, 0]} size={[thickness, zoneDepth]} />
            <SafetyStrip position={[hw, y, 0]} size={[thickness, zoneDepth]} />
        </group>
    );
}

// ─── Factory Walls (Back, Left, Right) ───────────
function FactoryWalls({ isDark }) {
    const backWallColor = isDark ? '#12121f' : '#f3f4f6';
    const sideWallColor = isDark ? '#0f0f1a' : '#e5e7eb';
    const halfH = WALL_HEIGHT / 2;

    return (
        <group>
            {/* Back wall */}
            <mesh position={[0, halfH, BACK_Z]} receiveShadow>
                <boxGeometry args={[WALL_WIDTH + 2, WALL_HEIGHT, 0.5]} />
                <meshStandardMaterial color={backWallColor} roughness={0.9} metalness={0.02} />
            </mesh>

            {/* Left side wall */}
            <mesh position={[LEFT_X, halfH, (BACK_Z + FRONT_Z) / 2]} receiveShadow>
                <boxGeometry args={[0.5, WALL_HEIGHT, WALL_DEPTH + 1]} />
                <meshStandardMaterial color={sideWallColor} roughness={0.9} metalness={0.02} />
            </mesh>

            {/* Right side wall */}
            <mesh position={[RIGHT_X, halfH, (BACK_Z + FRONT_Z) / 2]} receiveShadow>
                <boxGeometry args={[0.5, WALL_HEIGHT, WALL_DEPTH + 1]} />
                <meshStandardMaterial color={sideWallColor} roughness={0.9} metalness={0.02} />
            </mesh>
        </group>
    );
}

// ─── Front Wall with Door Opening ────────────────
function FrontWallWithDoor({ isDark }) {
    const wallColor = isDark ? '#12121f' : '#f3f4f6';
    const halfH = WALL_HEIGHT / 2;
    const doorWidth = 4;
    const doorHeight = 4;
    const sidePanelWidth = (WALL_WIDTH + 2 - doorWidth) / 2;

    return (
        <group>
            {/* Left panel */}
            <mesh position={[-(doorWidth / 2 + sidePanelWidth / 2), halfH, FRONT_Z]} receiveShadow>
                <boxGeometry args={[sidePanelWidth, WALL_HEIGHT, 0.5]} />
                <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.02} />
            </mesh>

            {/* Right panel */}
            <mesh position={[(doorWidth / 2 + sidePanelWidth / 2), halfH, FRONT_Z]} receiveShadow>
                <boxGeometry args={[sidePanelWidth, WALL_HEIGHT, 0.5]} />
                <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.02} />
            </mesh>

            {/* Top panel above door */}
            <mesh position={[0, doorHeight + (WALL_HEIGHT - doorHeight) / 2, FRONT_Z]} receiveShadow>
                <boxGeometry args={[doorWidth, WALL_HEIGHT - doorHeight, 0.5]} />
                <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0.02} />
            </mesh>
        </group>
    );
}

// ─── EXIT Sign above door ────────────────────────
function ExitSign({ isDark }) {
    const doorTop = 4; // matches doorHeight
    return (
        <group>
            {/* Red EXIT sign background */}
            <mesh position={[0, doorTop + 0.7, FRONT_Z - 0.3]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[2.5, 0.8]} />
                <meshStandardMaterial color="#dc2626" roughness={0.5} />
            </mesh>
            {/* EXIT text */}
            <Text
                position={[0, doorTop + 0.7, FRONT_Z - 0.35]}
                rotation={[0, Math.PI, 0]}
                fontSize={0.45}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.3}
            >
                EXIT
            </Text>
        </group>
    );
}

// ─── Single TV — 3D GLB Model ────────────────────
// wallNormal: unit vector pointing INTO the room from the wall surface
// e.g. back wall: [0,0,1], left wall: [1,0,0], right wall: [-1,0,0]
function TV3D({ position, modelPath, wallNormal = [0, 0, 1], scale = 1 }) {
    const { scene } = useGLTF(modelPath);

    const { cloned, autoRotation, offset } = useMemo(() => {
        const clone = scene.clone(true);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
                child.frustumCulled = true;
            }
        });

        // Measure bounding box to find model dimensions
        const box = new THREE.Box3().setFromObject(clone);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Center model at origin
        clone.position.sub(center);

        // Find the thinnest axis — that's the TV depth
        const dims = [
            { axis: 'x', val: size.x },
            { axis: 'y', val: size.y },
            { axis: 'z', val: size.z },
        ];
        dims.sort((a, b) => a.val - b.val);
        const thinAxis = dims[0].axis; // Thinnest dimension

        // Compute rotation to align TV's thin axis with wallNormal
        // TV screen faces opposite to its thin-axis direction
        const wn = new THREE.Vector3(...wallNormal).normalize();
        let rotY = 0;

        if (thinAxis === 'z') {
            // Model depth along Z — screen faces ±Z
            // We want screen to face wallNormal direction
            rotY = Math.atan2(wn.x, wn.z);
        } else if (thinAxis === 'x') {
            // Model depth along X — screen faces ±X
            rotY = Math.atan2(wn.x, wn.z) - Math.PI / 2;
        } else {
            // Model depth along Y (unusual for a TV)
            rotY = Math.atan2(wn.x, wn.z);
        }

        // Push model forward from wall by half its thickness
        const halfDepth = dims[0].val / 2 * scale;

        return {
            cloned: clone,
            autoRotation: [0, rotY, 0],
            offset: [wn.x * halfDepth, 0, wn.z * halfDepth],
        };
    }, [scene, wallNormal, scale]);

    return (
        <group
            position={[
                position[0] + offset[0],
                position[1] + offset[1],
                position[2] + offset[2],
            ]}
            rotation={autoRotation}
            scale={[scale, scale, scale]}
        >
            <primitive object={cloned} />
        </group>
    );
}

// ─── Wall Screens (3D TV models) ─────────────────
function WallScreens({ isDark }) {
    if (isDark) return null;

    // Position TVs right at the wall inner surface
    // TV3D auto-pushes model forward by half its thickness
    const backZ = BACK_Z + 0.25;     // Just in front of back wall
    const leftX = LEFT_X + 0.25;     // Just in front of left wall
    const rightX = RIGHT_X - 0.25;   // Just in front of right wall
    const tvScale = 1.5;

    return (
        <group>
            {/* ── Back Wall ── screen faces +Z */}
            <TV3D
                position={[0, 2.5, backZ]}
                modelPath="/assets/tv/tv1.glb"
                wallNormal={[0, 0, 1]}
                scale={tvScale}
            />

            {/* ── Left Wall ── screen faces +X */}
            <TV3D
                position={[leftX, 2.5, 4]}
                modelPath="/assets/tv/tv2.glb"
                wallNormal={[1, 0, 0]}
                scale={tvScale}
            />
            <TV3D
                position={[leftX, 2.5, -4]}
                modelPath="/assets/tv/tv3.glb"
                wallNormal={[1, 0, 0]}
                scale={tvScale}
            />

            {/* ── Right Wall ── screen faces -X */}
            <TV3D
                position={[rightX, 2.5, 4]}
                modelPath="/assets/tv/tv4.glb"
                wallNormal={[-1, 0, 0]}
                scale={tvScale}
            />
            <TV3D
                position={[rightX, 2.5, -4]}
                modelPath="/assets/tv/tv5.glb"
                wallNormal={[-1, 0, 0]}
                scale={tvScale}
            />
        </group>
    );
}

// ─── Wall Signage ────────────────────────────────
function WallSignage({ isDark }) {
    if (isDark) return null;

    return (
        <Text
            position={[0, 5.5, BACK_Z + 0.3]}
            fontSize={0.6}
            color="#1e3a8a"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
        >
            L&T SMT SHOP FLOOR - ZONE B
        </Text>
    );
}

// ─── Industrial Lighting ─────────────────────────
function IndustrialLighting({ isDark }) {
    return (
        <>
            <ambientLight intensity={isDark ? 0.3 : 0.5} />

            <directionalLight
                position={[8, 15, 10]}
                intensity={isDark ? 0.7 : 1.1}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-left={-15}
                shadow-camera-right={15}
                shadow-camera-top={15}
                shadow-camera-bottom={-15}
                shadow-camera-near={0.5}
                shadow-camera-far={50}
                shadow-bias={-0.001}
            />

            <hemisphereLight
                args={[
                    isDark ? '#1a1a3a' : '#b0c4de',
                    isDark ? '#080810' : '#f5f5f0',
                    isDark ? 0.25 : 0.6,
                ]}
            />

            {isDark ? (
                <>
                    <pointLight position={[-4, 3, -3]} intensity={0.3} color="#00b4ff" />
                    <pointLight position={[4, 2, -2]} intensity={0.15} color="#6366f1" />
                </>
            ) : (
                <>
                    <pointLight position={[0, 6, 6]} intensity={0.3} color="#ffffff" />
                    <pointLight position={[-5, 8, -5]} intensity={0.2} color="#ffffff" />
                </>
            )}
        </>
    );
}

// ─── Main Export ─────────────────────────────────
export default function FactoryEnvironment({ isDark = false, floorY = -0.55 }) {
    return (
        <group>
            <IndustrialLighting isDark={isDark} />

            {/* Factory Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY, 0]} receiveShadow>
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial
                    color={isDark ? '#0e0e1a' : '#ffffff'}
                    roughness={isDark ? 0.4 : 0.85}
                    metalness={isDark ? 0.7 : 0.05}
                    side={THREE.FrontSide}
                />
            </mesh>

            {/* Yellow Safety Markings */}
            {!isDark && <SafetyMarkings floorY={floorY} zoneWidth={12} zoneDepth={8} />}

            {/* Walls — Back, Left, Right */}
            <FactoryWalls isDark={isDark} />

            {/* Front Wall with Door Opening */}
            <FrontWallWithDoor isDark={isDark} />

            {/* EXIT Sign above door */}
            <ExitSign isDark={isDark} />

            {/* TV Screens on Walls */}
            <WallScreens isDark={isDark} />

            {/* Wall Signage Text */}
            <WallSignage isDark={isDark} />
        </group>
    );
}
