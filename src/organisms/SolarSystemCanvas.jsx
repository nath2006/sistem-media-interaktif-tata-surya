import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function SolarSystemCanvas({ onSelectPlanet, onReset, selectedKey }) {
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
    camRadius: 48,
    focused: null,
    resetFocus: null,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ===== Scene =====
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 2000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.28));
    const sunLight = new THREE.PointLight(0xffffff, 2.4, 500);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 650;
      starPos[i * 3 + 0] = (Math.random() - 0.5) * r;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * r;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * r;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.7 })));

    // Textures
    const loader = new THREE.TextureLoader();
    const tex = (name) => loader.load(`/textures/${name}`);

    // Sun
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(3.2, 48, 48),
      new THREE.MeshStandardMaterial({
        emissive: new THREE.Color(0xffaa33),
        emissiveIntensity: 1.2,
        map: tex("sun.jpg"),
      })
    );
    scene.add(sun);

    // Orbit line helper
    const createOrbitLine = (distance) => {
      const curve = new THREE.EllipseCurve(0, 0, distance, distance, 0, Math.PI * 2, false, 0);
      const points = curve.getPoints(128).map((p) => new THREE.Vector3(p.x, 0, p.y));
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.LineLoop(geo, new THREE.LineBasicMaterial({ transparent: true, opacity: 0.35 }));
      scene.add(line);
      return line;
    };

    // Glow sprite
    const makeGlow = (color = 0x66ccff) => {
      const c = document.createElement("canvas");
      c.width = 128; c.height = 128;
      const ctx = c.getContext("2d");
      const g = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
      g.addColorStop(0, "rgba(255,255,255,0.9)");
      g.addColorStop(0.25, "rgba(120,220,255,0.45)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);

      const t = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({
        map: t,
        color,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(6, 6, 1);
      sprite.visible = false;
      return sprite;
    };

    // Planet Data
    const planetData = [
      { key: "mercury", name: "Merkurius", radius: 0.7, distance: 8,  speed: 0.02,  rot: 0.01,  texture: "mercury.jpg",
        desc: "Planet terdekat dari Matahari. Permukaan berbatu dan suhu ekstrem." },
      { key: "venus",   name: "Venus",     radius: 1.1, distance: 11, speed: 0.015, rot: 0.008, texture: "venus.jpg",
        desc: "Atmosfer tebal, efek rumah kaca kuat. Sering disebut ‘kembaran’ Bumi." },
      { key: "earth",   name: "Bumi",      radius: 1.2, distance: 14, speed: 0.012, rot: 0.02,  texture: "earth.jpg",
        desc: "Satu-satunya planet yang diketahui mendukung kehidupan." },
      { key: "mars",    name: "Mars",      radius: 0.9, distance: 17, speed: 0.01,  rot: 0.018, texture: "mars.jpg",
        desc: "Planet merah. Kandidat eksplorasi manusia karena kemiripan tertentu dengan Bumi." },
    ];

    // Create planets
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

      // Glow
      const glowColor =
        p.key === "mars" ? 0xff8855 :
        p.key === "earth" ? 0x55aaff :
        p.key === "venus" ? 0xffdd66 :
        0xaad0ff;

      const glow = makeGlow(glowColor);
      mesh.add(glow);
      mesh.userData.glow = glow;

      orbit.add(mesh);
      createOrbitLine(p.distance);
      planets.push({ orbit, mesh });
    });

    // Camera simple orbit controls (drag + zoom)
    const s = stateRef.current;
    s.renderer = renderer;
    s.scene = scene;
    s.camera = camera;
    s.planets = planets;
    s.sun = sun;

    const updateCameraFromAngles = () => {
      const x = s.camRadius * Math.cos(s.pitch) * Math.sin(s.yaw);
      const y = s.camRadius * Math.sin(s.pitch);
      const z = s.camRadius * Math.cos(s.pitch) * Math.cos(s.yaw);
      camera.position.set(x, y + 10, z);
      camera.lookAt(0, 0, 0);
    };

    s.yaw = 0;
    s.pitch = 0;
    s.camRadius = 48;
    updateCameraFromAngles();

    const onPointerDown = (e) => {
      s.isDragging = true;
      s.prev.x = e.clientX;
      s.prev.y = e.clientY;
    };
    const onPointerUp = () => (s.isDragging = false);

    const onPointerMove = (e) => {
      if (!s.isDragging) return;
      const dx = e.clientX - s.prev.x;
      const dy = e.clientY - s.prev.y;
      s.prev.x = e.clientX;
      s.prev.y = e.clientY;

      s.yaw -= dx * 0.005;
      s.pitch -= dy * 0.005;
      s.pitch = Math.max(-0.9, Math.min(0.6, s.pitch));
      updateCameraFromAngles();
    };

    const onWheel = (e) => {
      // IMPORTANT: prevent scroll page
      e.preventDefault();
      s.camRadius += e.deltaY * 0.02;
      s.camRadius = Math.max(18, Math.min(120, s.camRadius));
      updateCameraFromAngles();
    };

    const focusPlanet = (mesh) => {
      s.focused = mesh;

      // glow on selected
      planets.forEach(({ mesh: m }) => m.userData.glow && (m.userData.glow.visible = false));
      mesh.userData.glow && (mesh.userData.glow.visible = true);

      const wp = new THREE.Vector3();
      mesh.getWorldPosition(wp);

      const dir = wp.clone().normalize();
      const camPos = wp
        .clone()
        .add(dir.multiplyScalar(mesh.userData.radius * 8 + 6))
        .add(new THREE.Vector3(0, 3, 0));

      gsap.to(camera.position, {
        duration: 1.2,
        x: camPos.x, y: camPos.y, z: camPos.z,
        ease: "power3.out",
        onUpdate: () => camera.lookAt(wp),
      });

      onSelectPlanet?.(mesh.userData);
    };

    const resetFocus = () => {
      s.focused = null;

      planets.forEach(({ mesh }) => mesh.userData.glow && (mesh.userData.glow.visible = false));

      s.yaw = 0; s.pitch = 0; s.camRadius = 48;
      const resetPos = new THREE.Vector3(0, 18, 45);

      gsap.to(camera.position, {
        duration: 1.2,
        x: resetPos.x, y: resetPos.y, z: resetPos.z,
        ease: "power3.out",
        onUpdate: () => camera.lookAt(0, 0, 0),
      });

      onReset?.();
    };

    s.resetFocus = resetFocus;

    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      s.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      s.mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      s.raycaster.setFromCamera(s.mouse, camera);
      const meshes = planets.map((p) => p.mesh);
      const hits = s.raycaster.intersectObjects(meshes, true);
      if (!hits.length) return;
      focusPlanet(hits[0].object);
    };

    // Events
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);

    // wheel ONLY on canvas + passive false
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("click", onClick);

    // Animate
    const animate = () => {
      s.animId = requestAnimationFrame(animate);

      planets.forEach(({ orbit, mesh }) => {
        orbit.rotation.y += orbit.userData.speed;
        mesh.rotation.y += mesh.userData.rot;
      });
      sun.rotation.y += 0.002;

      if (s.focused) {
        const wp = new THREE.Vector3();
        s.focused.getWorldPosition(wp);
        camera.lookAt(wp);
      }

      renderer.render(scene, camera);
    };
    animate();

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
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("click", onClick);

      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [onSelectPlanet, onReset]);

  // If React panel triggers reset (optional)
  useEffect(() => {
    const s = stateRef.current;
    if (!selectedKey) return;
  }, [selectedKey]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
