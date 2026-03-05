import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const DigitalTwin3D = ({ microplasticData, tankDimensions = { width: 4, height: 3, depth: 4 } }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const particlesRef = useRef([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0e27);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            60,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(6, 4, 6);
        camera.lookAt(0, 1.5, 0);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 3;
        controls.maxDistance = 15;
        controls.maxPolarAngle = Math.PI / 2;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        const pointLight1 = new THREE.PointLight(0x4a9eff, 0.5);
        pointLight1.position.set(-3, 2, 3);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff6b9d, 0.3);
        pointLight2.position.set(3, 2, -3);
        scene.add(pointLight2);

        // Create rectangular water tank
        createWaterTank(scene, tankDimensions);

        // Create floor
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1f3a,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        scene.add(floor);

        // Grid helper
        const gridHelper = new THREE.GridHelper(20, 20, 0x2a3f5f, 0x1a2f4f);
        gridHelper.position.y = 0.01;
        scene.add(gridHelper);

        // Animation loop
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Animate particles
            particlesRef.current.forEach((particle, index) => {
                if (particle.mesh) {
                    // Float animation
                    particle.mesh.position.y += particle.velocity.y;
                    particle.mesh.position.x += particle.velocity.x;
                    particle.mesh.position.z += particle.velocity.z;

                    // Rotation
                    particle.mesh.rotation.x += particle.rotationSpeed.x;
                    particle.mesh.rotation.y += particle.rotationSpeed.y;
                    particle.mesh.rotation.z += particle.rotationSpeed.z;

                    // Bounce off tank boundaries
                    const { width, height, depth } = tankDimensions;
                    if (particle.mesh.position.y > height - 0.2 || particle.mesh.position.y < 0.2) {
                        particle.velocity.y *= -1;
                    }
                    if (Math.abs(particle.mesh.position.x) > width / 2 - 0.2) {
                        particle.velocity.x *= -1;
                    }
                    if (Math.abs(particle.mesh.position.z) > depth / 2 - 0.2) {
                        particle.velocity.z *= -1;
                    }
                }
            });

            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            if (!containerRef.current) return;
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        setIsLoading(false);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            controls.dispose();
        };
    }, [tankDimensions]);

    // Update particles when microplastic data changes
    useEffect(() => {
        if (!sceneRef.current || !microplasticData?.particles) return;

        // Remove old particles
        particlesRef.current.forEach(particle => {
            if (particle.mesh) {
                sceneRef.current.remove(particle.mesh);
                particle.mesh.geometry.dispose();
                particle.mesh.material.dispose();
            }
        });
        particlesRef.current = [];

        // Add new particles
        microplasticData.particles.forEach(particleData => {
            const particle = createMicroplasticParticle(particleData);
            sceneRef.current.add(particle.mesh);
            particlesRef.current.push(particle);
        });
    }, [microplasticData]);

    return (
        <div className="relative w-full h-full">
            <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden" />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                    <div className="text-white text-lg">Loading 3D View...</div>
                </div>
            )}
        </div>
    );
};

// Helper function to create water tank
function createWaterTank(scene, dimensions) {
    const { width, height, depth } = dimensions;

    // Tank frame (edges)
    const frameMaterial = new THREE.LineBasicMaterial({ color: 0x4a9eff, linewidth: 2 });

    const edges = [
        // Bottom rectangle
        [[width / 2, 0, depth / 2], [width / 2, 0, -depth / 2]],
        [[width / 2, 0, -depth / 2], [-width / 2, 0, -depth / 2]],
        [[-width / 2, 0, -depth / 2], [-width / 2, 0, depth / 2]],
        [[-width / 2, 0, depth / 2], [width / 2, 0, depth / 2]],
        // Top rectangle
        [[width / 2, height, depth / 2], [width / 2, height, -depth / 2]],
        [[width / 2, height, -depth / 2], [-width / 2, height, -depth / 2]],
        [[-width / 2, height, -depth / 2], [-width / 2, height, depth / 2]],
        [[-width / 2, height, depth / 2], [width / 2, height, depth / 2]],
        // Vertical edges
        [[width / 2, 0, depth / 2], [width / 2, height, depth / 2]],
        [[width / 2, 0, -depth / 2], [width / 2, height, -depth / 2]],
        [[-width / 2, 0, -depth / 2], [-width / 2, height, -depth / 2]],
        [[-width / 2, 0, depth / 2], [-width / 2, height, depth / 2]]
    ];

    edges.forEach(([start, end]) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...start),
            new THREE.Vector3(...end)
        ]);
        const line = new THREE.Line(geometry, frameMaterial);
        scene.add(line);
    });

    // Water (transparent box)
    const waterGeometry = new THREE.BoxGeometry(width, height, depth);
    const waterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1e90ff,
        transparent: true,
        opacity: 0.15,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,
        thickness: 0.5
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = height / 2;
    scene.add(water);

    // Tank walls (slightly visible)
    const wallMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide
    });

    const walls = new THREE.Mesh(waterGeometry, wallMaterial);
    walls.position.y = height / 2;
    scene.add(walls);
}

// Helper function to create microplastic particle
function createMicroplasticParticle(particleData) {
    const colors = {
        'PET': 0xff6b6b,
        'HDPE': 0x4ecdc4,
        'PVC': 0xffe66d,
        'LDPE': 0x95e1d3,
        'PP': 0xf38181,
        'PS': 0xaa96da,
        'Other': 0xfcbad3
    };

    const color = colors[particleData.type] || 0xffffff;

    // Random particle shape
    const shapes = ['sphere', 'box', 'cylinder'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    let geometry;
    const size = 0.08 + Math.random() * 0.08; // 0.08-0.16

    switch (shape) {
        case 'sphere':
            geometry = new THREE.SphereGeometry(size, 8, 8);
            break;
        case 'box':
            geometry = new THREE.BoxGeometry(size, size, size);
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(size * 0.5, size * 0.5, size * 1.5, 8);
            break;
    }

    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.4,
        metalness: 0.3,
        emissive: color,
        emissiveIntensity: 0.2
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;

    // Set position from detection data
    const pos = particleData.position3D;
    mesh.position.set(pos.x, pos.y, pos.z);

    // Random velocity for floating animation
    const velocity = {
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.008,
        z: (Math.random() - 0.5) * 0.005
    };

    const rotationSpeed = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
    };

    return {
        mesh,
        velocity,
        rotationSpeed,
        data: particleData
    };
}

export default DigitalTwin3D;
