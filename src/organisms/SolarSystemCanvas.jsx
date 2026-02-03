import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { planetData } from "../data/planets";

export default function SolarSystemCanvas({
  onSelectPlanet,
  onReset,
  selectedKey,
  speedMultiplier = 1,
  spinMultiplier = 1,
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    planets: [],
    sun: null,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    animId: null,
    isDragging: false,
    prev: { x: 0, y: 0 },
    yaw: 0,
    pitch: 0,
    camRadius: 60, // Sedikit lebih jauh untuk melihat semua
    focused: null,
    clock: new THREE.Clock(),
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ===== Scene =====
    const scene = new THREE.Scene();
    // Background sedikit keuncuan untuk kesan "Space for Kids"
    scene.background = new THREE.Color(0x050510);
    // Fog tipis biar kedalaman
    scene.fog = new THREE.FogExp2(0x050510, 0.002);

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 3000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Cahaya
    scene.add(new THREE.AmbientLight(0xffffff, 0.4)); // Lebih terang ambientnya
    const sunLight = new THREE.PointLight(0xffaa33, 2.5, 1000);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Bintang-bintang berwarna
    const starGeo = new THREE.BufferGeometry();
    const starCount = 3000;
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 800;
      starPos[i * 3 + 0] = (Math.random() - 0.5) * r;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * r;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * r;

      const color = new THREE.Color();
      // Warna bintang variasi: putih, biru muda, kuning
      color.setHSL(Math.random(), 0.8, 0.8); 
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 1.0, vertexColors: true, transparent: true, opacity: 0.8 })));

    // Textures
    const loader = new THREE.TextureLoader();
    const tex = (name) => loader.load(`/textures/${name}`);

    // Matahari (High Poly)
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(4, 128, 128), // Increased segments for smoothness
      new THREE.MeshStandardMaterial({
        emissive: new THREE.Color(0xffaa00),
        emissiveIntensity: 2.5,
        map: tex("sun.jpg"),
        roughness: 0.4,
        metalness: 0.8,
      })
    );
    scene.add(sun);

    // Matahari Glow Layers (Core + Atmosphere)
    const makeSunGlow = (size, opacity, color) => {
        const c = document.createElement("canvas");
        c.width = 256; c.height = 256; // Higher res texture
        const ctx = c.getContext("2d");
        const g = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
        g.addColorStop(0, color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0,0,256,256);
        
        const mat = new THREE.SpriteMaterial({ 
          map: new THREE.CanvasTexture(c), 
          color: 0xffffff, 
          transparent: true, 
          blending: THREE.AdditiveBlending,
          opacity: opacity
        });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(size, size, 1);
        return sprite;
    }
    
    // Core glow (bright orange)
    sun.add(makeSunGlow(12, 1.0, "rgba(255, 150, 0, 1)"));
    // Outer atmosphere (softer reddish)
    sun.add(makeSunGlow(20, 0.4, "rgba(255, 50, 0, 0.6)"));

    // Orbit Helper
    const createOrbitLine = (distance, color) => {
      const curve = new THREE.EllipseCurve(0, 0, distance, distance, 0, Math.PI * 2, false, 0);
      const points = curve.getPoints(128).map((p) => new THREE.Vector3(p.x, 0, p.y));
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.LineLoop(geo, new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.2 }));
      scene.add(line);
      return line;
    };

    // Glow selection
    const makeGlow = (color) => {
      const c = document.createElement("canvas");
      c.width = 64; c.height = 64;
      const ctx = c.getContext("2d");
      const g = ctx.createRadialGradient(32, 32, 5, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      const t = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: t, color: color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(4, 4, 1);
      sprite.visible = false;
      return sprite;
    };

    // SETUP PLANETS
    const planets = [];
    planetData.forEach((p) => {
      const orbit = new THREE.Object3D();
      orbit.userData.speed = p.speed;
      scene.add(orbit);

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(p.radius, 48, 48),
        new THREE.MeshStandardMaterial({ map: tex(p.texture) })
      );
      mesh.position.set(p.distance, 0, 0);
      mesh.userData = { ...p };

      // Cincin Saturnus
      if (p.key === 'saturn') {
         const ringGeo = new THREE.RingGeometry(p.radius * 1.4, p.radius * 2.2, 64);
         const pos = ringGeo.attributes.position;
         const v3 = new THREE.Vector3();
         for(let i=0; i<pos.count; i++){
             v3.fromBufferAttribute(pos, i);
             ringGeo.attributes.uv.setXY(i, v3.length() < (p.radius * 1.8) ? 0 : 1, 1);
         }
         const ringMat = new THREE.MeshBasicMaterial({ 
             map: tex('saturn_ring.png'), // Asumsi tekstur ada, kalau tidak pakai warna
             color: 0xaa8866,
             side: THREE.DoubleSide, 
             transparent: true,
             opacity: 0.8
         });
         const ring = new THREE.Mesh(ringGeo, ringMat);
         ring.rotation.x = -Math.PI / 2;
         mesh.add(ring);
      }
      
      // Cincin Uranus (tipis)
       if (p.key === 'uranus') {
         const ringMm = new THREE.Mesh(
             new THREE.RingGeometry(p.radius * 1.5, p.radius * 1.6, 64),
             new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 })
         );
         ringMm.rotation.x = -Math.PI / 2;
         mesh.add(ringMm);
      }


      const glow = makeGlow(p.planetColor);
      glow.scale.set(p.radius * 3, p.radius * 3, 1);
      mesh.add(glow);
      mesh.userData.glow = glow;

      orbit.add(mesh);
      createOrbitLine(p.distance, p.planetColor);
      planets.push({ orbit, mesh });
    });

    // Reference
    const s = stateRef.current;
    s.renderer = renderer;
    s.scene = scene;
    s.camera = camera;
    s.planets = planets;
    s.sun = sun;

    // Camera Init
    s.yaw = 0.5;
    s.pitch = 0.3;
    const updateCameraFromAngles = () => {
        if(s.focused) return;
        const x = s.camRadius * Math.cos(s.pitch) * Math.sin(s.yaw);
        const y = s.camRadius * Math.sin(s.pitch);
        const z = s.camRadius * Math.cos(s.pitch) * Math.cos(s.yaw);
        camera.position.set(x, y, z);
        camera.lookAt(0, 0, 0);
    };
    updateCameraFromAngles();


    // INPUT HANDLERS
    const onPointerDown = (e) => {
        s.isDragging = true;
        s.prev.x = e.clientX;
        s.prev.y = e.clientY;
    };
    const onPointerUp = () => (s.isDragging = false);
    const onPointerMove = (e) => {
        if (!s.isDragging || s.focused) return;
        const dx = e.clientX - s.prev.x;
        const dy = e.clientY - s.prev.y;
        s.prev.x = e.clientX;
        s.prev.y = e.clientY;
        s.yaw -= dx * 0.005;
        s.pitch -= dy * 0.005;
        s.pitch = Math.max(0.1, Math.min(Math.PI/2 - 0.1, s.pitch));
        updateCameraFromAngles();
    };
    const onWheel = (e) => {
        if(s.focused) return;
        e.preventDefault();
        s.camRadius += e.deltaY * 0.05;
        s.camRadius = Math.max(20, Math.min(200, s.camRadius));
        updateCameraFromAngles();
    };

    const onClick = (e) => {
        const rect = renderer.domElement.getBoundingClientRect();
        s.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        s.mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        s.raycaster.setFromCamera(s.mouse, camera);
        
        // Raycast against planets
        const meshes = planets.map(p => p.mesh);
        const hits = s.raycaster.intersectObjects(meshes, true); // true for recursive children (rings etc) -> actually mesh is parent
        // Just intersect meshes directly
        const planetHits = s.raycaster.intersectObjects(meshes, false);

        if (planetHits.length > 0) {
            focusPlanet(planetHits[0].object);
        } else {
             // Maybe click on background? Do nothing or clear focus? 
             // Ideally we want to be able to click empty space to reset, but let's keep it explicit via button first
        }
    };

    const focusPlanet = (mesh) => {
        s.focused = mesh;
        planets.forEach(p => p.mesh.userData.glow.visible = false);
        mesh.userData.glow.visible = true;

        const wp = new THREE.Vector3();
        mesh.getWorldPosition(wp);
        
        // Offset camera
        const dist = mesh.userData.radius * 4 + 5;
        
        gsap.to(camera.position, {
            duration: 1.5,
            x: wp.x + dist, y: wp.y + dist * 0.5, z: wp.z + dist,
            ease: "expo.out",
            onUpdate: () => {
                const curWp = new THREE.Vector3();
                mesh.getWorldPosition(curWp);
                camera.lookAt(curWp); 
            }
        });

        onSelectPlanet?.(mesh.userData);
    };

    stateRef.current.resetFocus = () => {
        s.focused = null;
        planets.forEach(p => p.mesh.userData.glow.visible = false);
        
        // Return to orbit view
        gsap.to(camera.position, {
            duration: 1.5,
            x: s.camRadius * Math.cos(s.pitch) * Math.sin(s.yaw),
            y: s.camRadius * Math.sin(s.pitch),
            z: s.camRadius * Math.cos(s.pitch) * Math.cos(s.yaw),
            ease: "power2.out",
            onUpdate: () => camera.lookAt(0,0,0)
        });
        onReset?.();
    };

    // LISTENERS
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("click", onClick);

    // LOOP
    const animate = () => {
        s.animId = requestAnimationFrame(animate);
        const dt = s.clock.getDelta();

        // Rotate Planets around Sun
        planets.forEach(({ orbit, mesh }) => {
            orbit.rotation.y += orbit.userData.speed * dt * speedMultiplier;
            mesh.rotation.y += 0.5 * dt * spinMultiplier;
        });

        // Rotate Sun
        sun.rotation.y += 0.05 * dt;

        // Follow focus
        if (s.focused) {
            const wp = new THREE.Vector3();
            s.focused.getWorldPosition(wp);
            // Camera position is handled by GSAP initially, but if planet moves, camera should track? 
            // For simplicity in children's app, maybe PAUSE orbit when focused?
            // Or just update lookAt.
            camera.lookAt(wp);
        }

        renderer.render(scene, camera);
    };
    animate();

    // RESIZE
    const onResize = () => {
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
        cancelAnimationFrame(s.animId);
         window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      if(renderer.domElement){
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        renderer.domElement.removeEventListener("wheel", onWheel);
        renderer.domElement.removeEventListener("click", onClick);
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };

  }, [speedMultiplier, spinMultiplier, onSelectPlanet, onReset]);

  // Handle external reset prop or effect if needed
  useEffect(() => {
     if(!selectedKey && stateRef.current.resetFocus) {
         stateRef.current.resetFocus();
     }
  }, [selectedKey]);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
