import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button, Crosshair } from "../m1";
import { tvParts } from "./parts";
import { TvModel, TV_FLOOR_Y } from "./TvModel";
import { useRiveScreen, type AvatarScreen } from "./useRiveScreen";
import { usePhotoTexture, useStaticNoise } from "./useScreenTexture";

type PointerTilt = { x: number; y: number };

const IDLE_MS = 2500;
const STATIC_MS = 260;

// Feeds the avatar's gaze each frame: toward the cursor, or toward "Get in touch" once the
// visitor has been still for a moment. Also keeps the static and avatar textures fresh.
const ScreenDriver = ({
  avatar,
  host,
  pointer,
  lastMove,
  staticActive,
  refreshStatic,
}: {
  avatar: AvatarScreen | null;
  host: RefObject<HTMLElement | null>;
  pointer: RefObject<PointerTilt>;
  lastMove: RefObject<number>;
  staticActive: boolean;
  refreshStatic: () => void;
}) => {
  useFrame((_, delta) => {
    if (staticActive) refreshStatic();
    if (!avatar) return;
    avatar.texture.needsUpdate = true;

    const rect = host.current?.getBoundingClientRect();
    if (!rect) return;
    // The screen sits left of the frame's centre
    const originX = rect.left + rect.width * 0.42;
    const originY = rect.top + rect.height * 0.45;

    let targetX = ((pointer.current.x + 1) / 2) * window.innerWidth;
    let targetY = ((pointer.current.y + 1) / 2) * window.innerHeight;
    const cta = document.querySelector(".m1-hero .m1-btn-primary");
    if (cta && performance.now() - lastMove.current > IDLE_MS) {
      const button = cta.getBoundingClientRect();
      targetX = button.left + button.width / 2;
      targetY = button.top + button.height / 2;
    }

    const lookX = THREE.MathUtils.clamp(((targetX - originX) / (window.innerWidth / 2)) * 100, -100, 100);
    const lookY = THREE.MathUtils.clamp(((targetY - originY) / (window.innerHeight / 2)) * 100, -100, 100);
    const inputX = avatar.input("lookX");
    const inputY = avatar.input("lookY");
    if (inputX) inputX.value = THREE.MathUtils.damp(Number(inputX.value), lookX, 6, delta);
    if (inputY) inputY.value = THREE.MathUtils.damp(Number(inputY.value), lookY, 6, delta);
  });

  return null;
};

// Leans the TV toward the cursor anywhere on the page, and turns it to a three-quarter
// view when exploded so the parts separate in depth, pulling the camera back to fit them.
const CAMERA_Z = { assembled: 7.1, exploded: 9.4 };

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
    const cameraZ = exploded ? CAMERA_Z.exploded : CAMERA_Z.assembled;
    if (still) {
      group.rotation.set(targetX, targetY, 0);
      camera.position.z = cameraZ;
      return;
    }
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetY, 4, delta);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetX, 4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraZ, 5, delta);
  });

  return <group ref={ref}>{children}</group>;
};

type HeroTVProps = {
  fallback: ReactNode;
};

export default function HeroTV({ fallback }: HeroTVProps) {
  const [exploded, setExploded] = useState(false);
  const [ready, setReady] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(pointer: fine)");
  const { ref, inView } = useInView<HTMLDivElement>();
  const photo = usePhotoTexture("/avatar.webp");
  const avatar = useRiveScreen(ref, ready);
  const staticNoise = useStaticNoise();
  const [channel, setChannel] = useState<1 | 2>(1);
  const [staticActive, setStaticActive] = useState(false);
  const staticTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pointer = useRef<PointerTilt>({ x: 0, y: 0 });
  const lastMove = useRef(0);

  useEffect(() => {
    if (!finePointer) return;
    const onMove = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
      lastMove.current = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [finePointer]);

  useEffect(() => {
    const input = avatar?.input("exploded");
    if (input) input.value = exploded;
  }, [avatar, exploded]);

  useEffect(() => {
    if (!avatar) return;
    if (inView) avatar.rive.play();
    else avatar.rive.pause();
  }, [avatar, inView]);

  useEffect(() => () => clearTimeout(staticTimer.current), []);

  const switchChannel = () => {
    setChannel((current) => (current === 1 ? 2 : 1));
    if (reducedMotion) return;
    setStaticActive(true);
    clearTimeout(staticTimer.current);
    staticTimer.current = setTimeout(() => setStaticActive(false), STATIC_MS);
  };

  const showAvatar = avatar !== null && channel === 1;
  const screen = staticActive ? staticNoise.texture : showAvatar ? avatar.texture : photo;
  const parts = tvParts.map((part) =>
    part.id === "screen" && avatar ? { ...part, value: `${part.value} + Rive` } : part
  );

  return (
    <div className="m1-hero-media">
      <div ref={ref} className={cn("m1-hero-tv", ready && photo && "is-ready")}>
        {fallback}
        <div className="m1-hero-tv-canvas">
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [0, 0.15, CAMERA_Z.assembled], fov: 30 }}
            frameloop={inView ? "always" : "never"}
            gl={{ antialias: true, alpha: true }}
            style={{ touchAction: "pan-y" }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.NeutralToneMapping;
              gl.toneMappingExposure = 1.15;
              setReady(true);
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
                  <TvModel
                    exploded={exploded}
                    instant={reducedMotion}
                    screen={screen}
                    onScreenClick={showAvatar ? () => avatar.input("poke")?.fire() : undefined}
                    onKnobClick={avatar ? switchChannel : undefined}
                  />
                </Rig>
              </Float>
            </PresentationControls>

            <ScreenDriver
              avatar={showAvatar ? avatar : null}
              host={ref}
              pointer={pointer}
              lastMove={lastMove}
              staticActive={staticActive}
              refreshStatic={staticNoise.refresh}
            />

            <ContactShadows
              position={[0, TV_FLOOR_Y - 0.01, 0]}
              opacity={0.35}
              scale={5}
              blur={2.6}
              far={2.5}
              color="#1c1e21"
            />
          </Canvas>
        </div>
        <Crosshair className="m1-hero-tv-cross is-tl" />
        <Crosshair className="m1-hero-tv-cross is-br" />
      </div>

      <div className="m1-hero-tv-actions">
        {avatar ? (
          <Button variant="ghost" onClick={switchChannel} aria-label={`Switch to channel ${channel === 1 ? 2 : 1}`}>
            {channel === 1 ? "CH 01" : "CH 02"}
          </Button>
        ) : (
          <span className="m1-micro">{exploded ? "EXPLODED VIEW" : finePointer ? "DRAG TO TURN" : "MODULE/01 · UNIT-01"}</span>
        )}
        <Button variant="ghost" onClick={() => setExploded((value) => !value)} aria-pressed={exploded}>
          {exploded ? "Reassemble" : "Reverse engineer"}
        </Button>
      </div>

      <div className={cn("m1-bom", exploded && "is-open")} aria-hidden={!exploded}>
        <dl>
          {parts.map((part) => (
            <div key={part.id} className="m1-bom-row">
              <dt className="m1-hud">
                <span className="m1-hudlabel-code">{part.code}</span> {part.name}
              </dt>
              <dd>{part.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
