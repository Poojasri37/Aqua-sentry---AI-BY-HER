import React, { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Cylinder, Sphere, MeshDistortMaterial, Environment, Float, Sparkles, Html, useProgress, SpotLight } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Activity, Droplets, Zap } from "lucide-react";

// --- LOADER ---
function Loader() {
    const { progress } = useProgress();
    return <Html center className="text-cyan-400 font-mono text-xs">{progress.toFixed(0)}% loaded</Html>;
}

// --- MICROPLASTICS / PARTICLES ---
const Microplastics = ({ turbidity, lightOn }) => {
    // Safety check
    const safeTurbidity = Number.isFinite(turbidity) ? turbidity : 0;
    const count = Math.max(20, Math.floor(safeTurbidity * 100)); // Lots of particles for effect

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            // Random positions inside the tank radius
            const r = Math.random() * 1.8;
            const theta = Math.random() * Math.PI * 2;
            const x = r * Math.cos(theta);
            const y = (Math.random() - 0.5) * 5;
            const z = r * Math.sin(theta);
            temp.push({ position: [x, y, z], size: Math.random() * 0.05 + 0.01 });
        }
        return temp;
    }, [count]);

    return (
        <group>
            {particles.map((p, i) => (
                <Float key={i} speed={1} rotationIntensity={5} floatIntensity={2}>
                    {/* Irregular shapes simulating microplastics */}
                    <mesh position={p.position}>
                        <dodecahedronGeometry args={[p.size, 0]} />
                        <meshPhysicalMaterial
                            color={lightOn ? "#ffffff" : "#cccccc"}
                            emissive={lightOn ? "#06b6d4" : "#000000"} // Glow when light is on
                            emissiveIntensity={lightOn ? 2 : 0}
                            roughness={0.2}
                            metalness={0.8}
                            transparent
                            opacity={0.9}
                        />
                    </mesh>
                </Float>
            ))}
            {/* Tiny sparkles to simulate suspended solids in the light beam */}
            {lightOn && <Sparkles count={50} scale={4} size={5} speed={0.4} opacity={1} color="#ffffff" />}
        </group>
    );
};

// --- LIGHT RAY (Tyndall Effect) ---
const LightRay = () => {
    return (
        <group position={[0, 3, 0]} rotation={[0, 0, Math.PI / 12]}> {/* Slight angle */}
            {/* The visible beam cone */}
            <mesh position={[0, -3, 0]}>
                <cylinderGeometry args={[0.05, 0.5, 8, 32, 1, true]} />
                <meshBasicMaterial
                    color="#06b6d4"
                    transparent
                    opacity={0.1}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            {/* Core beam */}
            <mesh position={[0, -3, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 8]} />
                <meshBasicMaterial color="#ccfbf1" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            {/* Light Source at top */}
            <SpotLight
                position={[0, 0, 0]}
                angle={0.15}
                penumbra={1}
                intensity={5}
                distance={10}
                color="#06b6d4"
                castShadow
            />
        </group>
    )
}

// --- GREEN INLET PIPE ---
const InletPipe = () => {
    return (
        <group position={[1.5, 3.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <Cylinder args={[0.15, 0.15, 2]} >
                <meshStandardMaterial color="#10b981" roughness={0.3} metalness={0.5} />
            </Cylinder>
            {/* Water flowing out */}
            <mesh position={[0, -1.5, 0]}>
                <cylinderGeometry args={[0.1, 0.12, 1.5]} />
                <meshPhysicalMaterial
                    color="#a5f3fc"
                    transmission={0.9}
                    roughness={0.1}
                    transparent
                    opacity={0.8}
                />
            </mesh>
        </group>
    )
}

// --- MAIN TANK MODEL ---
const WaterTank = ({ waterLevel, turbidity }) => {
    const waterRef = useRef();

    useFrame((state) => {
        if (waterRef.current) {
            // Distort water based on "turbulence"
            waterRef.current.distort = 0.3;
            waterRef.current.speed = 1.5;
        }
    });

    return (
        <group>
            {/* 1. White Tank Walls (Interior View) */}
            {/* Back Half cylinder to see inside */}
            <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
                <cylinderGeometry args={[2.2, 2.2, 6, 32, 1, true, 0, Math.PI]} />
                <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} roughness={0.1} metalness={0.1} />
            </mesh>
            {/* Bottom */}
            <Cylinder args={[2.2, 2.2, 0.2, 32]} position={[0, -3.1, 0]}>
                <meshStandardMaterial color="#f8fafc" roughness={0.1} />
            </Cylinder>

            {/* 2. Water Volume */}
            <mesh position={[0, -3 + (waterLevel / 100) * 3, 0]}>
                <cylinderGeometry args={[2.15, 2.15, Math.max(0.1, (waterLevel / 100) * 6), 32]} />
                <MeshDistortMaterial
                    ref={waterRef}
                    color={turbidity > 5 ? "#0ea5e9" : "#67e8f9"} // Darker blue if dirty
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0}
                    metalness={0.1}
                    transmission={0.6} // Semi-transparent water
                    opacity={0.8}
                />
            </mesh>

            {/* 3. Inlet Pipe from Image */}
            <InletPipe />

            {/* 4. The Light Ray (Analysis Beam) */}
            <LightRay />

            {/* 5. Microplastics / Contaminants */}
            <group position={[0, -1, 0]}>
                <Microplastics turbidity={turbidity} lightOn={true} />
            </group>

        </group>
    );
};

const DigitalTwin3D = ({ sensorData }) => {
    // Robust Defaults
    const level = Number.isFinite(sensorData?.level) ? sensorData.level : 75;
    const turbidity = Number.isFinite(sensorData?.turbidity) ? sensorData.turbidity : 5.5; // Default to some turbidity to show effect

    return (
        <div className="w-full h-[600px] relative bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl">

            <Canvas camera={{ position: [0, 1, 7], fov: 45 }}>
                <Suspense fallback={<Loader />}>
                    {/* Dark environment to make the light ray pop */}
                    <color attach="background" args={['#020617']} />
                    <fog attach="fog" args={['#020617', 5, 20]} />

                    <ambientLight intensity={0.2} />
                    <pointLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />

                    <Environment preset="city" />

                    <group position={[0, -0.5, 0]}>
                        <WaterTank waterLevel={level} turbidity={turbidity} />
                    </group>

                    <OrbitControls
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 1.5}
                        maxAzimuthAngle={Math.PI / 4}
                        minAzimuthAngle={-Math.PI / 4}
                    />
                </Suspense>
            </Canvas>

            {/* Scanlines Overlay for "Digital" feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
        </div>
    );
};

export default DigitalTwin3D;
