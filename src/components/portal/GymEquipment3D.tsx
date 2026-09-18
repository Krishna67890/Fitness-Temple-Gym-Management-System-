"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type EquipmentType =
  | "bench-press"
  | "dumbbells"
  | "barbell"
  | "squat-rack"
  | "cable-machine"
  | "lat-pulldown"
  | "treadmill"
  | "exercise-bike"
  | "leg-press"
  | "chest-press"
  | "shoulder-press"
  | "row-machine";

interface GymEquipment3DProps {
  equipment?: EquipmentType | string;
  className?: string;
  autoRotate?: boolean;
}

export const GymEquipment3D: React.FC<GymEquipment3DProps> = ({
  equipment = "bench-press",
  className = "w-full h-80 min-h-[320px]",
  autoRotate = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(autoRotate);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const dom = renderer.domElement;
    dom.style.width = "100%";
    dom.style.height = "100%";
    dom.style.display = "block";
    container.appendChild(dom);

    // Studio Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const goldSpot = new THREE.SpotLight(0xffd700, 3.5);
    goldSpot.position.set(4, 7, 5);
    goldSpot.angle = Math.PI / 4;
    goldSpot.penumbra = 0.5;
    scene.add(goldSpot);

    const cyanRim = new THREE.DirectionalLight(0x00ffff, 1.8);
    cyanRim.position.set(-4, 3, -4);
    scene.add(cyanRim);

    const floorLight = new THREE.PointLight(0xffaa00, 1.0, 10);
    floorLight.position.set(0, -1, 2);
    scene.add(floorLight);

    // Circular Illuminated Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.15, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x181818,
      metalness: 0.8,
      roughness: 0.2,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.1;
    scene.add(pedestal);

    // Glowing Gold Ring on Floor
    const ringGeo = new THREE.TorusGeometry(2.45, 0.035, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.02;
    scene.add(ring);

    // Grid Floor Overlay
    const gridHelper = new THREE.GridHelper(6, 12, 0xffd700, 0x222222);
    gridHelper.position.y = -1.09;
    scene.add(gridHelper);

    // Materials Library
    const steelDark = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.95,
      roughness: 0.2,
    });
    const steelGold = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x332200,
      emissiveIntensity: 0.2,
    });
    const leatherRed = new THREE.MeshStandardMaterial({
      color: 0xcc2222,
      metalness: 0.1,
      roughness: 0.5,
    });
    const plateBlack = new THREE.MeshStandardMaterial({
      color: 0x2e2e2e,
      metalness: 0.7,
      roughness: 0.35,
    });

    const equipmentGroup = new THREE.Group();
    scene.add(equipmentGroup);

    // Procedural Equipment Models
    const normEquip = (equipment || "bench-press").toLowerCase().replace(/[\s_]+/g, "-");

    if (normEquip.includes("dumbbell")) {
      // Hexagonal Dumbbell Set on Chrome Stand
      for (let side of [-1, 1]) {
        const db = new THREE.Group();
        // Knurled Handle
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 16), steelGold);
        handle.rotation.z = Math.PI / 2;
        db.add(handle);

        // Hex heads
        for (let h of [-1, 1]) {
          const head = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.28, 6), plateBlack);
          head.rotation.z = Math.PI / 2;
          head.position.x = h * 0.45;
          db.add(head);

          const ringTrim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.02, 12, 6), steelGold);
          ringTrim.rotation.y = Math.PI / 2;
          ringTrim.position.x = h * 0.45;
          db.add(ringTrim);
        }
        db.position.set(side * 0.75, -0.4, 0);
        db.rotation.y = side * 0.35;
        equipmentGroup.add(db);
      }
    } else if (normEquip.includes("barbell") || normEquip.includes("deadlift")) {
      // Olympic Barbell with bumper plates
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 3.8, 24), steelGold);
      bar.rotation.z = Math.PI / 2;
      bar.position.y = -0.2;
      equipmentGroup.add(bar);

      for (let side of [-1, 1]) {
        for (let i = 0; i < 3; i++) {
          const pRadius = 0.58 - i * 0.05;
          const plate = new THREE.Mesh(new THREE.CylinderGeometry(pRadius, pRadius, 0.1, 32), plateBlack);
          plate.rotation.z = Math.PI / 2;
          plate.position.set(side * (1.25 + i * 0.14), -0.2, 0);
          equipmentGroup.add(plate);

          const rim = new THREE.Mesh(new THREE.TorusGeometry(pRadius, 0.015, 16, 32), steelGold);
          rim.rotation.y = Math.PI / 2;
          rim.position.set(side * (1.25 + i * 0.14), -0.2, 0);
          equipmentGroup.add(rim);
        }
      }
    } else if (normEquip.includes("squat") || normEquip.includes("rack")) {
      // Power Cage / Squat Rack
      for (let x of [-1, 1]) {
        for (let z of [-0.6, 0.6]) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.12), steelDark);
          post.position.set(x * 0.9, 0, z);
          equipmentGroup.add(post);
        }
      }
      const barTop1 = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 0.1), steelGold);
      barTop1.position.set(0, 1.2, -0.6);
      const barTop2 = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 0.1), steelGold);
      barTop2.position.set(0, 1.2, 0.6);
      equipmentGroup.add(barTop1, barTop2);

      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.8, 20), steelGold);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(0, 0.5, 0);
      equipmentGroup.add(bar);
    } else if (normEquip.includes("lat") || normEquip.includes("pulldown") || normEquip.includes("cable")) {
      // Dual Pulley / Lat Pulldown Machine
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.4, 0.5), steelDark);
      tower.position.set(0, 0, -0.4);
      equipmentGroup.add(tower);

      const topArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.3), steelGold);
      topArm.position.set(0, 1.2, 0.25);
      equipmentGroup.add(topArm);

      const latBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0, 20), steelGold);
      latBar.rotation.z = Math.PI / 2;
      latBar.position.set(0, 0.85, 0.7);
      equipmentGroup.add(latBar);

      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.85), leatherRed);
      seat.position.set(0, -0.55, 0.5);
      equipmentGroup.add(seat);
    } else if (normEquip.includes("treadmill")) {
      // Motorized Treadmill
      const deck = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.2, 2.5), steelDark);
      deck.position.set(0, -0.88, 0);
      equipmentGroup.add(deck);

      const belt = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.04, 2.1), plateBlack);
      belt.position.set(0, -0.76, 0);
      equipmentGroup.add(belt);

      for (let s of [-1, 1]) {
        const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 16), steelGold);
        rail.position.set(s * 0.58, -0.15, 0.65);
        rail.rotation.x = -0.22;
        equipmentGroup.add(rail);
      }

      const consoleBox = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.35, 0.1), plateBlack);
      consoleBox.position.set(0, 0.55, 0.85);
      consoleBox.rotation.x = -0.3;
      equipmentGroup.add(consoleBox);
    } else {
      // Default: Pro Olympic Bench Press
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.14, 2.1), leatherRed);
      pad.position.set(0, -0.45, 0.1);
      equipmentGroup.add(pad);

      for (let z of [-0.65, 0.65]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.12), steelDark);
        leg.position.set(0, -0.8, z);
        equipmentGroup.add(leg);
      }

      for (let x of [-0.68, 0.68]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.9, 0.12), steelDark);
        post.position.set(x, -0.15, -0.35);
        equipmentGroup.add(post);

        const hook = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.22), steelGold);
        hook.position.set(x, 0.5, -0.25);
        equipmentGroup.add(hook);
      }

      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.5, 24), steelGold);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(0, 0.56, -0.22);
      equipmentGroup.add(bar);

      for (let side of [-1, 1]) {
        for (let p = 0; p < 2; p++) {
          const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.48 - p * 0.05, 0.48 - p * 0.05, 0.09, 24), plateBlack);
          plate.rotation.z = Math.PI / 2;
          plate.position.set(side * (1.0 + p * 0.13), 0.56, -0.22);
          equipmentGroup.add(plate);

          const rim = new THREE.Mesh(new THREE.TorusGeometry(0.48 - p * 0.05, 0.015, 12, 24), steelGold);
          rim.rotation.y = Math.PI / 2;
          rim.position.set(side * (1.0 + p * 0.13), 0.56, -0.22);
          equipmentGroup.add(rim);
        }
      }
    }

    // Interactive Drag Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      equipmentGroup.rotation.y += deltaX * 0.012;
      equipmentGroup.rotation.x = Math.max(-0.4, Math.min(0.5, equipmentGroup.rotation.x + deltaY * 0.006));
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouse.x;
      equipmentGroup.rotation.y += deltaX * 0.014;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    dom.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // ResizeObserver ensures perfect resizing even if container dimensions shift
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newW = container.clientWidth || 400;
      const newH = container.clientHeight || 320;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isRotating && !isDragging) {
        equipmentGroup.rotation.y += 0.01;
      }

      // Subtle levitation
      equipmentGroup.position.y = Math.sin(elapsed * 1.8) * 0.035;
      ring.rotation.z = elapsed * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      if (container.contains(dom)) {
        container.removeChild(dom);
      }

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [equipment, isRotating]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-2xl cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* 3D Model Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
          3D Equipment Arsenal • {equipment.toString().replace(/-/g, " ")}
        </span>
      </div>

      {/* Rotation toggle */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsRotating(!isRotating);
          }}
          className="px-3 py-1.5 bg-black/80 hover:bg-primary hover:text-black border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gray-300 transition-all backdrop-blur-md"
        >
          {isRotating ? "Pause Spin" : "Auto Spin"}
        </button>
      </div>

      {/* Touch/Drag hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-[9px] font-mono uppercase tracking-widest text-gray-400 bg-black/70 px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
        Drag to Orbit • 360° Studio View
      </div>
    </div>
  );
};
