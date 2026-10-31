import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button, Crosshair } from "../m1";
import { tvParts } from "./parts";
import { TvCanvas } from "./TvCanvas";
import { usePointerTilt, type PointerTilt } from "./usePointerTilt";
import { useRiveScreen, type AvatarScreen } from "./useRiveScreen";
import { usePhotoTexture, useStaticNoise } from "./useScreenTexture";

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
  const { pointer, lastMove } = usePointerTilt(finePointer);
  const handleLoaded = useCallback(() => setReady(true), []);

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
          <TvCanvas
            inView={inView}
            exploded={exploded}
            reducedMotion={reducedMotion}
            finePointer={finePointer}
            pointer={pointer}
            screen={screen}
            onScreenClick={showAvatar ? () => avatar.input("poke")?.fire() : undefined}
            onKnobClick={avatar ? switchChannel : undefined}
            onLoaded={handleLoaded}
          >
            <ScreenDriver
              avatar={showAvatar ? avatar : null}
              host={ref}
              pointer={pointer}
              lastMove={lastMove}
              staticActive={staticActive}
              refreshStatic={staticNoise.refresh}
            />
          </TvCanvas>
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
