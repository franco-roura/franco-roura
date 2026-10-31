import { Suspense, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import { TvModel, TV_FLOOR_Y } from "./TvModel";
import type { PointerTilt } from "./usePointerTilt";

// The camera sits a little above the TV, like a product shot, and dollies back for the exploded view.
const CAMERA_DISTANCE = { assembled: 6.4, exploded: 9.8 };
const CAMERA_RISE = 0.25;
const LOOK_AT = new THREE.Vector3(0, 0.1, 0);

// Leans the TV toward the cursor anywhere on the page, and turns it to a three-quarter
// view when exploded so the parts separate in depth, pulling the camera back to fit them.
const Rig = ({
  pointer,
  exploded,
  still,
  children,
}: {
  pointer: RefObject<PointerTilt>;
  exploded: boolean;
  still: boolean;
  children: ReactNode;
}) => {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ camera }, delta) => {
    const group = ref.current;
    if (!group) return;
    const tilt = still ? { x: 0, y: 0 } : pointer.current;
    const targetY = (exploded ? -0.55 : -0.18) + tilt.x * 0.3;
    const targetX = (exploded ? 0.12 : 0.04) + tilt.y * 0.12;
    const distance = exploded ? CAMERA_DISTANCE.exploded : CAMERA_DISTANCE.assembled;
    if (still) {
      group.rotation.set(targetX, targetY, 0);
      camera.position.z = distance;
    } else {
      group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetY, 4, delta);
      group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetX, 4, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, distance, 5, delta);
    }
    camera.position.y = camera.position.z * CAMERA_RISE;
    camera.lookAt(LOOK_AT);
  });

  return <group ref={ref}>{children}</group>;
};

export type TvCanvasProps = {
  inView: boolean;
  exploded: boolean;
  reducedMotion: boolean;
  finePointer: boolean;
  pointer: RefObject<PointerTilt>;
  screen: THREE.Texture | null;
  onScreenClick?: (event: ThreeEvent<MouseEvent>) => void;
  onKnobClick?: (event: ThreeEvent<MouseEvent>) => void;
  onLoaded: () => void;
  // Extra scene logic, e.g. the hero's screen driver
  children?: ReactNode;
};

// The TV on its white studio sweep: lighting, drag controls, float and contact shadow.
export const TvCanvas = ({
  inView,
  exploded,
  reducedMotion,
  finePointer,
  pointer,
  screen,
  onScreenClick,
  onKnobClick,
  onLoaded,
  children,
}: TvCanvasProps) => (
  <Canvas
    dpr={[1, 1.75]}
    camera={{ position: [0, CAMERA_DISTANCE.assembled * CAMERA_RISE, CAMERA_DISTANCE.assembled], fov: 30 }}
    frameloop={inView ? "always" : "never"}
    gl={{ antialias: true, alpha: true }}
    style={{ touchAction: "pan-y" }}
    onCreated={({ gl, camera }) => {
      gl.toneMapping = THREE.NeutralToneMapping;
      gl.toneMappingExposure = 1.15;
      camera.lookAt(LOOK_AT);
    }}
  >
    {/* A studio softbox setup built from light panels, so no HDR file is downloaded */}
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={2.4} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[8, 3, 1]} />
      <Lightformer form="rect" intensity={1.6} position={[0, 0.5, 6]} scale={[5, 3, 1]} />
      <Lightformer form="rect" intensity={1.4} position={[-5, 1, 3]} rotation-y={Math.PI / 2.5} scale={[4, 5, 1]} />
      <Lightformer form="rect" intensity={0.9} position={[5, 0.5, 2]} rotation-y={-Math.PI / 2.5} scale={[3, 4, 1]} />
    </Environment>
    <directionalLight position={[3, 5, 4]} intensity={1.1} />

    <PresentationControls
      enabled={finePointer && !reducedMotion}
      global={false}
      cursor
      snap
      speed={1.4}
      polar={[-0.25, 0.25]}
      azimuth={[-0.9, 0.9]}
    >
      <Float
        enabled={!reducedMotion && !exploded}
        speed={1.3}
        rotationIntensity={0.15}
        floatIntensity={0.3}
        floatingRange={[-0.04, 0.04]}
      >
        <Rig pointer={pointer} exploded={exploded} still={reducedMotion || !finePointer}>
          <Suspense fallback={null}>
            <TvModel
              exploded={exploded}
              instant={reducedMotion}
              screen={screen}
              onScreenClick={onScreenClick}
              onKnobClick={onKnobClick}
              onLoaded={onLoaded}
            />
          </Suspense>
        </Rig>
      </Float>
    </PresentationControls>

    {children}

    <ContactShadows position={[0, TV_FLOOR_Y - 0.01, 0]} opacity={0.35} scale={5} blur={2.6} far={2.5} color="#1c1e21" />
  </Canvas>
);
