import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import AppLayout from "../templates/AppLayout";
import { Link } from "wouter";

// --- Spacetime Grid Component ---
function SpacetimeGrid({ objects }) {
  const meshRef = useRef();

  // Grid parameters
  const segments = 64;
  const size = 100;
  
  // Create plane geometry manually to update vertices
  const geometry = useMemo(() => new THREE.PlaneGeometry(size, size, segments, segments), []);

  useFrame(() => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position;
    
    // Deform grid based on objects (gravity wells)
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i); // Plane is actually X-Y in geometry, but we rotate it -X/2
        // Wait, PlaneGeometry is X-Y. We want X-Z plane usually.
        // Let's assume standard PlaneGeometry and we rotate mesh -PI/2 on X.
        // So vertex (x,y,0) -> world (x, 0, y) effectively after rotation?
        // Let's keep geometry flat X-Y, and deform Z (which becomes Y world).
        
        let zDeform = 0;

        objects.forEach(obj => {
           // OBJ position is world coordinates. 
           // Grid is centered at 0,0,0.
           // Distance from vertex (world x,z) to object (x,z)
           const dx = x - obj.position[0];
           const dy = y - (-obj.position[2]); // Z in world is -Y in plane local coords if rotated?
           // Simpler: Just map distance in 2D plane
           
           const distSq = dx*dx + dy*dy;
           // Gravity formula simplified: -Mass / (Distance + epsilon)
           const pull = obj.mass / (distSq + 5); 
           zDeform -= pull * 2; // Scale factor
        });
        
        // Clamp deform
        zDeform = Math.max(zDeform, -15);
        
        positions.setZ(i, zDeform);
    }
    
    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} geometry={geometry}>
      <meshStandardMaterial 
        color="#4488ff" 
        wireframe 
        transparent 
        opacity={0.3} 
        emissive="#001133"
      />
    </mesh>
  );
}

// --- Interactive Planet ---
function DraggablePlanet({ config, position, onPositionChange }) {
    // Simplified drag logic or just static place for now
    // For MVP phase 2, let's just render them. 
    // Interaction: click to drag?
    return (
        <mesh position={position}>
            <sphereGeometry args={[config.radius, 32, 32]} />
            <meshStandardMaterial color={config.color} />
            <Text position={[0, config.radius + 1, 0]} fontSize={1} color="white">
                {config.name}
            </Text>
        </mesh>
    );
}

// --- Main Page Component ---
import { planetData } from "../data/planets";

// ... imports

export default function GravitySimulation() {
  const [objects, setObjects] = useState(() => {
     // Initial Sun
     const init = [{ id: "sun", name: "Matahari", mass: 20, radius: 3, color: "#ffaa00", position: [0, 0, 0] }];
     
     // Add Planets from data (scaled down for sim view)
     planetData.forEach((p, i) => {
         // Spread them out on X axis for clear view, alternating Z slightly
         const xPos = 6 + (i * 3.5); 
         const zPos = (i % 2 === 0) ? 2 : -2;
         
         init.push({
             id: p.key,
             name: p.name,
             mass: p.radius * 2, // Approximation for visual impact
             radius: p.radius * 0.8,
             color: p.planetColor,
             position: [xPos, 0, zPos]
         });
     });
     return init;
  });

  const addPlanet = (mass) => {
    // ... REST OF FUNCTION


  const addPlanet = (mass) => {
     // Random pos near center
     const x = (Math.random() - 0.5) * 40;
     const z = (Math.random() - 0.5) * 40;
     setObjects([...objects, {
         id: Date.now(),
         name: "Planet Baru",
         mass: mass,
         radius: mass > 5 ? 1.5 : 0.8,
         color: mass > 5 ? "#44ffaa" : "#ff4444",
         position: [x, 0, z]
     }]);
  };
  
  const reset = () => {
    setObjects([{ id: "sun", name: "Matahari", mass: 20, radius: 3, color: "#ffaa00", position: [0, 0, 0] }]);
  };

  return (
    <AppLayout 
        topLeft={<Link href="/" className="text-white font-bold text-xl hover:text-cyan-400">← Kembali</Link>}
        topRight={<div className="text-white font-mono">Simulasi Gravitasi</div>}
    >
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 30, 40], fov: 60 }}>
          <color attach="background" args={['#02020a']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 20, 10]} intensity={1.5} />
          <Stars />
          
          <OrbitControls maxPolarAngle={Math.PI / 2.2} />
          
          <SpacetimeGrid objects={objects} />
          
          {objects.map(obj => (
              <DraggablePlanet key={obj.id} config={obj} position={obj.position} />
          ))}
          
        </Canvas>
        
        {/* UI Overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 p-4 rounded-2xl backdrop-blur-md border border-white/10">
            <button onClick={() => addPlanet(2)} className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg font-bold">
                + Planet Kecil
            </button>
            <button onClick={() => addPlanet(8)} className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg font-bold">
                + Planet Besar
            </button>
            <button onClick={reset} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg ml-4">
                Reset
            </button>
        </div>
        
        <div className="absolute top-24 left-8 max-w-xs text-white/70 text-sm bg-black/40 p-4 rounded-xl border border-white/10">
            <h3 className="text-white font-bold mb-2">Hukum Gravitasi Einstein/Newton</h3>
            <p>
                Lihat bagaimana massa benda melengkungkan ruang-waktu (jaring-jaring).
                Semakin besar massa (seperti Matahari), semakin dalam lengkungannya.
                Inilah yang membuat planet mengorbit!
            </p>
        </div>
      </div>
    </AppLayout>
  );
}
