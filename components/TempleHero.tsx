"use client";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotionPref } from "@/components/ReadingPrefsProvider";

/*
 * If perceived load time is poor, further decimate / Draco-compress
 * public/models/sulamani-temple.glb in Blender before deployment.
 * Do not try to simplify geometry at runtime.
 */
export const SULAMANI_MODEL_SRC = "/models/sulamani-temple.glb";

const ENTRANCE_DELAY_S = 0.28;
const ENTRANCE_DURATION_S = 1.35;
const AUTO_REV_SECONDS = 80;
const CAMERA_POS: [number, number, number] = [0.15, 1.42, 5.05];
const MAX_YAW = THREE.MathUtils.degToRad(12);
const MAX_PITCH = THREE.MathUtils.degToRad(7);

const KEY_COLOR = "#ffb56a";
const FILL_COLOR = "#8ea4b8";
const RIM_COLOR = "#c59b27";
const AMBIENT_SKY = "#f3ead8";
const AMBIENT_GROUND = "#5a3a2a";

type PointerState = {
  x: number;
  y: number;
  inside: boolean;
};

type TempleHeroProps = {
  /** Called after the GLB is fitted and one frame has drawn. */
  onReady?: () => void;
};

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function damp(current: number, target: number, dt: number, lambda = 3.15): number {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

class LoadBoundary extends Component<
  { onError: () => void; fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function SulamaniModel({ onFitted }: { onFitted: () => void }) {
  const { scene } = useGLTF(SULAMANI_MODEL_SRC);
  const group = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const node = group.current;
    if (!node) return;
    node.visible = false;
    node.position.set(0, 0, 0);
    node.scale.setScalar(1);
    const box = new THREE.Box3().setFromObject(node);
    const size = new THREE.Vector3();
    box.getSize(size);
    const height = Math.max(size.y, 0.001);
    node.scale.setScalar(2.15 / height);
    const next = new THREE.Box3().setFromObject(node);
    const center = new THREE.Vector3();
    next.getCenter(center);
    node.position.set(-center.x + 0.42, -next.min.y, -center.z);
    node.visible = true;
    onFitted();
  }, [scene, onFitted]);

  return (
    <group ref={group} visible={false}>
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
}

function TempleLights({
  pointer,
  reduceMotion,
}: {
  pointer: MutableRefObject<PointerState>;
  reduceMotion: boolean;
}) {
  const keyRef = useRef<THREE.DirectionalLight>(null);

  useFrame((_, dt) => {
    const light = keyRef.current;
    if (!light) return;

    const px = reduceMotion ? 0 : pointer.current.x;
    const py = reduceMotion ? 0 : pointer.current.y;

    light.position.x = damp(light.position.x, 3.2 + px * 1.85, dt, 2.4);
    light.position.y = damp(light.position.y, 4.2 + py * 0.6, dt, 2.4);
    light.position.z = damp(light.position.z, 2.05 - px * 1.05, dt, 2.4);
    light.intensity = damp(light.intensity, 2.35 + px * 0.5 + py * 0.14, dt, 2.2);
  });

  return (
    <>
      <directionalLight
        ref={keyRef}
        color={KEY_COLOR}
        intensity={2.35}
        position={[3.2, 4.2, 2.05]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.00028}
        shadow-normalBias={0.028}
        shadow-camera-near={1}
        shadow-camera-far={16}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={5}
        shadow-camera-bottom={-2}
      />
      <hemisphereLight args={[AMBIENT_SKY, AMBIENT_GROUND, 0.4]} />
      <ambientLight color={FILL_COLOR} intensity={0.18} />
      <directionalLight color={RIM_COLOR} intensity={0.72} position={[-3.1, 2.1, -3.2]} />
    </>
  );
}

function TempleRig({
  pointer,
  finePointer,
  reduceMotion,
  modelReady,
  onFitted,
  onRevealed,
}: {
  pointer: MutableRefObject<PointerState>;
  finePointer: boolean;
  reduceMotion: boolean;
  modelReady: boolean;
  onFitted: () => void;
  onRevealed: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const started = useRef<number | null>(null);
  const signalled = useRef(false);
  const autoYaw = useRef(0);
  const framesAfterFit = useRef(0);

  useFrame((state, dt) => {
    const node = group.current;
    if (!node) return;

    if (!modelReady) {
      node.visible = false;
      return;
    }
    node.visible = true;

    if (started.current === null) started.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - started.current;

    let scale = 1;
    if (!reduceMotion) {
      const t = THREE.MathUtils.clamp((elapsed - ENTRANCE_DELAY_S) / ENTRANCE_DURATION_S, 0, 1);
      scale = 0.92 + 0.08 * easeOutCubic(t);
    }
    node.scale.setScalar(scale);

    if (!signalled.current) {
      framesAfterFit.current += 1;
      if (framesAfterFit.current >= 2) {
        signalled.current = true;
        onRevealed();
      }
    }

    if (reduceMotion) {
      node.rotation.set(0, 0.18, 0);
      return;
    }

    if (finePointer) {
      const active = pointer.current.inside;
      const targetPitch = active ? pointer.current.y * MAX_PITCH : 0.02;
      const targetYaw = active ? pointer.current.x * MAX_YAW : 0.18;
      node.rotation.x = damp(node.rotation.x, targetPitch, dt, 2.6);
      node.rotation.y = damp(node.rotation.y, targetYaw, dt, 2.6);
    } else {
      autoYaw.current += (Math.PI * 2 * dt) / AUTO_REV_SECONDS;
      node.rotation.x = damp(node.rotation.x, 0.03, dt, 2.2);
      node.rotation.y = 0.18 + autoYaw.current;
    }
  });

  return (
    <group ref={group} visible={false}>
      <SulamaniModel onFitted={onFitted} />
    </group>
  );
}

function CameraAim() {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.lookAt(0.38, 1.05, 0);
  }, [camera]);
  return null;
}

function Scene({
  pointer,
  finePointer,
  reduceMotion,
  onRevealed,
}: {
  pointer: MutableRefObject<PointerState>;
  finePointer: boolean;
  reduceMotion: boolean;
  onRevealed: () => void;
}) {
  const [modelReady, setModelReady] = useState(false);
  const onFitted = useCallback(() => setModelReady(true), []);

  return (
    <>
      <CameraAim />
      <TempleLights pointer={pointer} reduceMotion={reduceMotion} />
      <TempleRig
        pointer={pointer}
        finePointer={finePointer}
        reduceMotion={reduceMotion}
        modelReady={modelReady}
        onFitted={onFitted}
        onRevealed={onRevealed}
      />
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.42}
        scale={8}
        blur={2.6}
        far={3.2}
        color="#110703"
      />
    </>
  );
}

/** Hall dusk still — umber ground, no photograph. */
function DuskStill() {
  return <div className="gallery-poster" aria-hidden="true" />;
}

export default function TempleHero({ onReady }: TempleHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerState>({ x: 0, y: 0, inside: true });
  const [mode, setMode] = useState<"check" | "3d" | "still">("check");
  const [revealed, setRevealed] = useState(false);
  const [finePointer, setFinePointer] = useState(true);
  const [loop, setLoop] = useState<"demand" | "always">("demand");
  const reduceMotion = useReducedMotionPref();
  const readySent = useRef(false);

  const fail = useCallback(() => setMode("still"), []);

  const handleReady = useCallback(() => {
    setRevealed(true);
    if (!reduceMotion) setLoop("always");
    if (!readySent.current) {
      readySent.current = true;
      onReady?.();
    }
  }, [onReady, reduceMotion]);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(fine.matches);
    sync();
    setMode(webglAvailable() ? "3d" : "still");
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (mode !== "3d" || !finePointer || reduceMotion) return;
    const stage =
      (rootRef.current?.closest(".gallery-room") as HTMLElement | null) ?? rootRef.current;
    if (!stage) return;

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      pointer.current.x = THREE.MathUtils.clamp(x, -1, 1);
      pointer.current.y = THREE.MathUtils.clamp(y, -1, 1);
      pointer.current.inside = true;
    };

    stage.addEventListener("pointermove", onMove);
    return () => stage.removeEventListener("pointermove", onMove);
  }, [mode, finePointer, reduceMotion]);

  if (mode === "still" || mode === "check") {
    return (
      <div className="hero-temple" ref={rootRef} aria-hidden="true">
        <DuskStill />
      </div>
    );
  }

  return (
    <div
      className="hero-temple"
      ref={rootRef}
      role="img"
      aria-label="A model of Sulamani Temple in Bagan, brick and stucco, lit as if at golden hour."
    >
      <LoadBoundary onError={fail} fallback={<DuskStill />}>
        <Suspense fallback={<DuskStill />}>
          <div className={`hero-temple-canvas${revealed ? " is-revealed" : ""}`}>
            <Canvas
              dpr={[1, 1.5]}
              shadows
              frameloop={reduceMotion ? "demand" : loop}
              camera={{ position: CAMERA_POS, fov: 28, near: 0.1, far: 40 }}
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: "high-performance",
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.14,
              }}
              onCreated={({ gl, camera, invalidate }) => {
                gl.setClearColor(0x000000, 0);
                camera.lookAt(0.38, 1.05, 0);
                invalidate();
              }}
              style={{ background: "transparent", pointerEvents: "none" }}
              aria-hidden="true"
            >
              <Scene
                pointer={pointer}
                finePointer={finePointer}
                reduceMotion={reduceMotion}
                onRevealed={handleReady}
              />
            </Canvas>
          </div>
        </Suspense>
      </LoadBoundary>
    </div>
  );
}
