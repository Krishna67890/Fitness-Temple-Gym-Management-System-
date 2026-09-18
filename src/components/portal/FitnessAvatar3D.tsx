"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type ExerciseDemoType =
  | "bench-press"
  | "squat"
  | "deadlift"
  | "bicep-curl"
  | "shoulder-press"
  | "push-up"
  | "lunge"
  | "lat-pulldown"
  | "pull-up"
  | "tricep-pushdown"
  | "leg-extension"
  | "row"
  | "lateral-raise"
  | "crunch"
  | "calf-raise"
  | "running"
  | "leg-press"
  | "face-pull"
  | "shrug"
  | "woodchop"
  | "fly";

interface FitnessAvatar3DProps {
  exercise?: ExerciseDemoType | string;
  className?: string;
  speedMultiplier?: number;
}

export const FitnessAvatar3D: React.FC<FitnessAvatar3DProps> = ({
  exercise = "bench-press",
  className = "w-full h-80 min-h-[320px]",
  speedMultiplier = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const dom = renderer.domElement;
    dom.style.width = "100%";
    dom.style.height = "100%";
    dom.style.display = "block";
    container.appendChild(dom);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const goldRim = new THREE.DirectionalLight(0xffd700, 3.2);
    goldRim.position.set(3.5, 5, 4);
    scene.add(goldRim);

    const blueRim = new THREE.DirectionalLight(0x00ffff, 1.8);
    blueRim.position.set(-4, 3, -3);
    scene.add(blueRim);

    const floorLight = new THREE.PointLight(0xffaa00, 0.8, 8);
    floorLight.position.set(0, -1, 2);
    scene.add(floorLight);

    // Circular Illuminated Pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.4, 0.12, 48),
      new THREE.MeshStandardMaterial({ color: 0x161616, metalness: 0.85, roughness: 0.25 })
    );
    pedestal.position.y = -1.1;
    scene.add(pedestal);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.03, 16, 64), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.04;
    scene.add(ring);

    // Avatar Styling Materials
    const jointMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.92,
      roughness: 0.18,
      emissive: 0x553300,
      emissiveIntensity: 0.25,
    });
    const limbMat = new THREE.MeshStandardMaterial({
      color: 0x242b35,
      metalness: 0.85,
      roughness: 0.25,
    });
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.2,
    });
    const propMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.7,
      roughness: 0.35,
    });

    // Procedural Avatar Skeleton Hierarchy
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 24), headMat);
    head.position.y = 1.6;
    avatarGroup.add(head);

    // Torso (Upper & Lower)
    const upperTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.55, 16), limbMat);
    upperTorso.position.y = 1.15;
    avatarGroup.add(upperTorso);

    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.3, 16), limbMat);
    pelvis.position.y = 0.75;
    avatarGroup.add(pelvis);

    // Arms: Shoulders, Biceps, Forearms, Hands
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.4, 1.35, 0);
    const rightArm = new THREE.Group();
    rightArm.position.set(0.4, 1.35, 0);

    const shoulderGeo = new THREE.SphereGeometry(0.12, 16, 16);
    leftArm.add(new THREE.Mesh(shoulderGeo, jointMat));
    rightArm.add(new THREE.Mesh(shoulderGeo, jointMat));

    const upperArmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.45, 12);
    const leftUpperArm = new THREE.Mesh(upperArmGeo, limbMat);
    leftUpperArm.position.y = -0.25;
    leftArm.add(leftUpperArm);

    const rightUpperArm = new THREE.Mesh(upperArmGeo, limbMat);
    rightUpperArm.position.y = -0.25;
    rightArm.add(rightUpperArm);

    const leftForearm = new THREE.Group();
    leftForearm.position.y = -0.48;
    const leftForearmMesh = new THREE.Mesh(upperArmGeo, limbMat);
    leftForearmMesh.position.y = -0.22;
    leftForearm.add(leftForearmMesh);
    leftArm.add(leftForearm);

    const rightForearm = new THREE.Group();
    rightForearm.position.y = -0.48;
    const rightForearmMesh = new THREE.Mesh(upperArmGeo, limbMat);
    rightForearmMesh.position.y = -0.22;
    rightForearm.add(rightForearmMesh);
    rightArm.add(rightForearm);

    avatarGroup.add(leftArm, rightArm);

    // Legs: Hips, Thighs, Shins, Feet
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.2, 0.65, 0);
    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.2, 0.65, 0);

    const thighGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.6, 12);
    const leftThigh = new THREE.Mesh(thighGeo, limbMat);
    leftThigh.position.y = -0.32;
    leftLeg.add(leftThigh);

    const rightThigh = new THREE.Mesh(thighGeo, limbMat);
    rightThigh.position.y = -0.32;
    rightLeg.add(rightThigh);

    const leftShin = new THREE.Group();
    leftShin.position.y = -0.62;
    const leftShinMesh = new THREE.Mesh(thighGeo, limbMat);
    leftShinMesh.position.y = -0.3;
    leftShin.add(leftShinMesh);
    leftLeg.add(leftShin);

    const rightShin = new THREE.Group();
    rightShin.position.y = -0.62;
    const rightShinMesh = new THREE.Mesh(thighGeo, limbMat);
    rightShinMesh.position.y = -0.3;
    rightShin.add(rightShinMesh);
    rightLeg.add(rightShin);

    avatarGroup.add(leftLeg, rightLeg);

    // Accessory / Barbell Prop
    const barbellProp = new THREE.Group();
    const barMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 16), jointMat);
    barMesh.rotation.z = Math.PI / 2;
    barbellProp.add(barMesh);

    const leftPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16), propMat);
    leftPlate.rotation.z = Math.PI / 2;
    leftPlate.position.x = -0.9;
    barbellProp.add(leftPlate);

    const rightPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16), propMat);
    rightPlate.rotation.z = Math.PI / 2;
    rightPlate.position.x = 0.9;
    barbellProp.add(rightPlate);

    avatarGroup.add(barbellProp);

    // Normalizing exercise string
    const norm = (exercise || "bench-press").toLowerCase();

    // Bench Surface if Bench Press or Push-up
    if (norm.includes("bench") || norm.includes("chest")) {
      const benchMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.15, 1.9),
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8, metalness: 0.4 })
      );
      benchMesh.position.set(0, -0.4, 0);
      scene.add(benchMesh);
      avatarGroup.rotation.x = -Math.PI / 2;
      avatarGroup.position.set(0, -0.15, 0);
      camera.position.set(2.4, 2.5, 3.4);
      camera.lookAt(0, 0, 0);
    } else if (norm.includes("push-up")) {
      avatarGroup.rotation.x = -Math.PI / 2;
      avatarGroup.position.set(0, -0.7, 0);
      camera.position.set(2.6, 1.8, 2.8);
      camera.lookAt(0, -0.4, 0);
      barbellProp.visible = false;
    } else if (norm.includes("pull-up")) {
      avatarGroup.position.set(0, -0.2, 0);
      camera.position.set(0, 1.4, 4.5);
      camera.lookAt(0, 1.2, 0);
    } else if (norm.includes("leg-extension") || norm.includes("leg-curl")) {
      const seatMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.6, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8, metalness: 0.4 })
      );
      seatMesh.position.set(0, -0.4, 0);
      scene.add(seatMesh);
      avatarGroup.position.set(0, 0.1, 0);
      camera.position.set(2.5, 1.2, 3.5);
      camera.lookAt(0, 0, 0);
    } else if (norm.includes("crunch") || norm.includes("sit-up")) {
      avatarGroup.rotation.x = -Math.PI / 2;
      avatarGroup.position.set(0, -1, 0);
      camera.position.set(2.5, 1.5, 2.5);
      camera.lookAt(0, 0, 0);
      barbellProp.visible = false;
    } else if (norm.includes("leg-press")) {
      avatarGroup.rotation.x = -Math.PI / 3;
      avatarGroup.position.set(0, -0.2, 0);
      camera.position.set(2.5, 1.5, 3.5);
      camera.lookAt(0, 0, 0);
      barbellProp.visible = false;
    } else if (norm.includes("treadmill") || norm.includes("running") || norm.includes("walk")) {
      const treadmillBase = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.15, 2.5),
        new THREE.MeshStandardMaterial({ color: 0x111111 })
      );
      treadmillBase.position.set(0, -1, 0.5);
      scene.add(treadmillBase);
      avatarGroup.position.set(0, -0.2, 0);
      camera.position.set(3, 1.5, 4);
      camera.lookAt(0, 0.5, 0);
      barbellProp.visible = false;
    } else {
      avatarGroup.position.set(0, -0.2, 0);
      camera.position.set(0, 1.1, 4.8);
      camera.lookAt(0, 0.8, 0);
    }

    // Interactive Drag Controls for 360 view
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
      avatarGroup.rotation.y += deltaX * 0.014;
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
      avatarGroup.rotation.y += deltaX * 0.016;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    dom.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // ResizeObserver ensures perfect resizing in flex/grid
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newW = container.clientWidth || 400;
      const newH = container.clientHeight || 320;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    let lastTime = performance.now();
    let elapsedTime = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      elapsedTime += delta;

      const time = elapsedTime * 2.2 * speedMultiplier;
      const cycle = Math.sin(time); // -1 to 1
      const normalizedCycle = (cycle + 1) / 2; // 0 to 1

      // Subtle rotation if toggled
      if (isRotating && !isDragging) {
        avatarGroup.rotation.y += 0.01;
      }

      // Update Prop visibility
      leftPlate.visible = !norm.includes("pull-up") && !norm.includes("push-up") && !norm.includes("leg-extension") && !norm.includes("treadmill") && !norm.includes("running") && !norm.includes("crunch") && !norm.includes("leg-press") && !norm.includes("face-pull") && !norm.includes("woodchop");
      rightPlate.visible = !norm.includes("pull-up") && !norm.includes("push-up") && !norm.includes("leg-extension") && !norm.includes("treadmill") && !norm.includes("running") && !norm.includes("crunch") && !norm.includes("leg-press") && !norm.includes("face-pull") && !norm.includes("woodchop");
      barbellProp.visible = !norm.includes("push-up") && !norm.includes("leg-extension") && !norm.includes("treadmill") && !norm.includes("running") && !norm.includes("crunch") && !norm.includes("leg-press") && !norm.includes("face-pull") && !norm.includes("woodchop");

      // Exercise Specific Kinematics
      if (norm.includes("squat")) {
        // Squat motion: hips drop, knees flex
        const squatDepth = Math.max(0, -cycle) * 0.55;
        avatarGroup.position.y = -0.2 - squatDepth;
        pelvis.position.z = -squatDepth * 0.4;
        upperTorso.rotation.x = squatDepth * 0.6;

        leftLeg.rotation.x = -squatDepth * 1.4;
        rightLeg.rotation.x = -squatDepth * 1.4;
        leftShin.rotation.x = squatDepth * 2.2;
        rightShin.rotation.x = squatDepth * 2.2;

        barbellProp.position.set(0, 1.45 - squatDepth, -0.15);
      } else if (norm.includes("push-up")) {
        // Push-up: horizontal body movement
        const pushDepth = normalizedCycle * 0.45;
        avatarGroup.position.y = -0.7 + pushDepth;

        // Arm movement for push-up
        leftArm.rotation.z = -0.8;
        rightArm.rotation.z = 0.8;
        leftForearm.rotation.x = (1 - normalizedCycle) * 1.5;
        rightForearm.rotation.x = (1 - normalizedCycle) * 1.5;
      } else if (norm.includes("pull-up")) {
        // Pull-up: body moves up to bar
        const pull = normalizedCycle;
        avatarGroup.position.y = -0.2 + pull * 0.7;

        leftArm.rotation.z = -1.2 + pull * 0.6;
        rightArm.rotation.z = 1.2 - pull * 0.6;
        leftArm.rotation.x = -0.3;
        rightArm.rotation.x = -0.3;

        leftForearm.rotation.x = pull * 2.2;
        rightForearm.rotation.x = pull * 2.2;

        // Fixed bar above
        barbellProp.position.set(0, 2.0 - pull * 0.7, 0.1);
      } else if (norm.includes("tricep") || norm.includes("pushdown")) {
        // Tricep Pushdown
        avatarGroup.position.set(0, -0.2, 0);
        leftArm.rotation.x = 0.3;
        rightArm.rotation.x = 0.3;
        leftArm.rotation.z = -0.1;
        rightArm.rotation.z = 0.1;

        const pushAngle = 2.0 - normalizedCycle * 1.8;
        leftForearm.rotation.x = pushAngle;
        rightForearm.rotation.x = pushAngle;

        barbellProp.position.set(0, 0.95 - normalizedCycle * 0.6, 0.35);
      } else if (norm.includes("leg-extension")) {
        // Seated Leg Extension
        avatarGroup.position.set(0, 0.1, 0);
        leftLeg.rotation.x = -Math.PI / 2 + 0.2;
        rightLeg.rotation.x = -Math.PI / 2 + 0.2;

        const extAngle = normalizedCycle * 1.4;
        leftShin.rotation.x = extAngle;
        rightShin.rotation.x = extAngle;

        upperTorso.rotation.x = 0.2;
        leftArm.position.set(-0.4, 1.2, 0.2);
        rightArm.position.set(0.4, 1.2, 0.2);
      } else if (norm.includes("leg-curl")) {
        // Seated Leg Curl (reverse of extension)
        avatarGroup.position.set(0, 0.1, 0);
        leftLeg.rotation.x = -Math.PI / 2 + 0.2;
        rightLeg.rotation.x = -Math.PI / 2 + 0.2;

        const curlAngle = -normalizedCycle * 1.2;
        leftShin.rotation.x = -0.2 + curlAngle;
        rightShin.rotation.x = -0.2 + curlAngle;

        upperTorso.rotation.x = 0.2;
      } else if (norm.includes("row")) {
        // Bent Over Row
        const pull = normalizedCycle;
        upperTorso.rotation.x = 1.1;
        avatarGroup.position.y = -0.4;

        leftArm.rotation.x = -0.2 - pull * 0.8;
        rightArm.rotation.x = -0.2 - pull * 0.8;
        leftForearm.rotation.x = 0.4 + pull * 1.2;
        rightForearm.rotation.x = 0.4 + pull * 1.2;

        barbellProp.position.set(0, 0.5 + pull * 0.5, 0.4);
      } else if (norm.includes("lateral") || norm.includes("raise")) {
        // Lateral Raise
        const lift = normalizedCycle;
        leftArm.rotation.z = -lift * 1.5;
        rightArm.rotation.z = lift * 1.5;

        barbellProp.visible = false;
      } else if (norm.includes("crunch") || norm.includes("sit-up")) {
        // Ab Crunch
        const crunch = normalizedCycle;
        upperTorso.rotation.x = 0.4 + crunch * 0.8;
        leftLeg.rotation.x = -1.2;
        rightLeg.rotation.x = -1.2;
        leftShin.rotation.x = 1.5;
        rightShin.rotation.x = 1.5;
      } else if (norm.includes("leg-press")) {
        // Leg Press
        const press = normalizedCycle;
        avatarGroup.position.y = -0.2 + press * 0.4;
        leftLeg.rotation.x = -1.5 + press * 1.2;
        rightLeg.rotation.x = -1.5 + press * 1.2;
        leftShin.rotation.x = 1.8 - press * 1.4;
        rightShin.rotation.x = 1.8 - press * 1.4;
      } else if (norm.includes("face-pull")) {
        // Face Pull
        const pull = normalizedCycle;
        leftArm.rotation.x = -1.2;
        rightArm.rotation.x = -1.2;
        leftArm.rotation.y = -0.5 - pull * 1.0;
        rightArm.rotation.y = 0.5 + pull * 1.0;
        leftForearm.rotation.y = pull * 1.5;
        rightForearm.rotation.y = -pull * 1.5;
      } else if (norm.includes("shrug")) {
        // Shrugs
        const shrug = normalizedCycle;
        leftArm.position.y = 1.35 + shrug * 0.15;
        rightArm.position.y = 1.35 + shrug * 0.15;
        head.position.y = 1.6 - shrug * 0.05;
        barbellProp.position.y = 0.8 + shrug * 0.15;
        barbellProp.position.z = 0.3;
      } else if (norm.includes("woodchop")) {
        // Cable Woodchop
        const chop = normalizedCycle;
        avatarGroup.rotation.y = -0.8 + chop * 1.6;
        leftArm.rotation.x = -1.0;
        rightArm.rotation.x = -1.0;
        leftArm.position.z = 0.2;
        rightArm.position.z = 0.2;
      } else if (norm.includes("fly")) {
        // Chest Fly
        const fly = normalizedCycle;
        leftArm.rotation.y = 1.2 - fly * 1.4;
        rightArm.rotation.y = -1.2 + fly * 1.4;
        leftArm.rotation.z = -0.2;
        rightArm.rotation.z = 0.2;
        barbellProp.visible = false;
      } else if (norm.includes("calf") || norm.includes("calf-raise")) {
        // Calf Raise
        const rise = normalizedCycle;
        avatarGroup.position.y = -0.2 + rise * 0.2;
        leftLeg.rotation.x = rise * 0.2;
        rightLeg.rotation.x = rise * 0.2;
      } else if (norm.includes("running") || norm.includes("treadmill") || norm.includes("walk")) {
        // Running motion
        const runCycle = time * 2;
        leftLeg.rotation.x = Math.sin(runCycle) * 0.8;
        rightLeg.rotation.x = Math.sin(runCycle + Math.PI) * 0.8;
        leftShin.rotation.x = Math.abs(Math.sin(runCycle)) * 0.8;
        rightShin.rotation.x = Math.abs(Math.sin(runCycle + Math.PI)) * 0.8;

        leftArm.rotation.x = Math.sin(runCycle + Math.PI) * 0.8;
        rightArm.rotation.x = Math.sin(runCycle) * 0.8;
        leftForearm.rotation.x = 1.2;
        rightForearm.rotation.x = 1.2;

        avatarGroup.position.y = -0.2 + Math.abs(Math.sin(runCycle * 2)) * 0.1;
      } else if (norm.includes("lunge")) {
        // Lunge: split leg stance and drop
        const lungeDepth = normalizedCycle * 0.6;
        avatarGroup.position.y = -0.2 - lungeDepth;

        // Split legs
        leftLeg.rotation.x = -0.8 - lungeDepth * 0.5;
        leftShin.rotation.x = 1.2 + lungeDepth * 0.5;

        rightLeg.rotation.x = 0.8 + lungeDepth * 0.5;
        rightShin.rotation.x = 0.8 + lungeDepth * 0.5;

        upperTorso.rotation.x = 0.1;
        barbellProp.visible = false;
      } else if (norm.includes("bicep") || norm.includes("curl")) {
        // Standing Bicep Curl
        avatarGroup.position.set(0, -0.2, 0);
        leftArm.rotation.x = 0;
        rightArm.rotation.x = 0;

        const curlAngle = 0.2 + normalizedCycle * 2.1;
        leftForearm.rotation.x = curlAngle;
        rightForearm.rotation.x = curlAngle;

        barbellProp.position.set(
          0,
          0.65 + normalizedCycle * 0.65,
          0.25 + Math.sin(curlAngle) * 0.2
        );
      } else if (norm.includes("shoulder") || norm.includes("press")) {
        // Overhead Press
        avatarGroup.position.set(0, -0.2, 0);
        const pressHeight = normalizedCycle * 0.75;
        leftArm.rotation.z = -0.3;
        rightArm.rotation.z = 0.3;
        leftForearm.rotation.x = 0.2 + (1 - normalizedCycle) * 1.4;
        rightForearm.rotation.x = 0.2 + (1 - normalizedCycle) * 1.4;

        barbellProp.position.set(0, 1.4 + pressHeight, 0.1);
      } else if (norm.includes("deadlift")) {
        // Deadlift hip hinge
        const hinge = Math.max(0, -cycle) * 0.7;
        avatarGroup.position.y = -0.2 - hinge * 0.4;
        upperTorso.rotation.x = hinge * 1.1;
        leftLeg.rotation.x = -hinge * 0.4;
        rightLeg.rotation.x = -hinge * 0.4;
        leftShin.rotation.x = hinge * 0.6;
        rightShin.rotation.x = hinge * 0.6;

        barbellProp.position.set(0, 0.2 + (1 - hinge / 0.7) * 0.6, 0.3);
      } else if (norm.includes("lat") || norm.includes("pulldown")) {
        // Lat Pulldown pull to chest
        const pull = normalizedCycle;
        leftArm.rotation.z = -0.5 - (1 - pull) * 0.9;
        rightArm.rotation.z = 0.5 + (1 - pull) * 0.9;
        leftForearm.rotation.x = pull * 0.8;
        rightForearm.rotation.x = pull * 0.8;
        barbellProp.position.set(0, 1.3 + (1 - pull) * 0.7, 0.2);
      } else {
        // Default: Bench Press Motion
        const pressCycle = normalizedCycle;
        barbellProp.position.set(0, 0.3 + pressCycle * 0.5, 0);

        leftArm.rotation.z = -0.4;
        rightArm.rotation.z = 0.4;
        leftForearm.rotation.x = (1 - pressCycle) * 1.2;
        rightForearm.rotation.x = (1 - pressCycle) * 1.2;
      }

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
  }, [exercise, speedMultiplier, isRotating]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-2xl cursor-grab active:cursor-grabbing ${className}`}
    >
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
          Form AI • 3D Biomechanical Avatar
        </span>
      </div>

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

      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] font-black uppercase italic tracking-wider text-white bg-black/70 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-sm">
          Demonstrating: <span className="text-primary">{exercise.toString().replace(/-/g, " ")}</span>
        </span>
        <span className="text-[9px] font-mono text-gray-400 bg-black/70 px-2.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-sm">
          Drag to Orbit 360°
        </span>
      </div>
    </div>
  );
};
