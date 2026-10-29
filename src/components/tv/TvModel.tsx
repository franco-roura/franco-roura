import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { tvParts, type TvPart, type TvPartId } from "./parts";
import { SCREEN_ASPECT } from "./useScreenTexture";

// Module/01 colors (tokens.json). three converts these sRGB hex values to linear itself.
const color = {
  shell: "#ffffff",
  signal: "#ff5f1f",
  visor: "#1c1e21",
  seam: "#c9ccd2",
  hudMark: "#7c818a",
  led: "#1fa45a",
};

const BODY = { width: 2.1, height: 1.6, depth: 0.8, radius: 0.3, notch: 0.34, bevel: 0.08 };
const FRONT_Z = BODY.depth / 2 + BODY.bevel;
const SCREEN = { x: -0.25, y: 0.04, height: 1.0 };
const SCREEN_WIDTH = SCREEN.height * SCREEN_ASPECT;

const roundedRectPath = <T extends THREE.Path>(path: T, width: number, height: number, radius: number, notch = 0) => {
  const x = -width / 2;
  const y = -height / 2;
  path.moveTo(x + radius, y);
  path.lineTo(x + width - radius, y);
  path.quadraticCurveTo(x + width, y, x + width, y + radius);
  if (notch > 0) {
    // One chamfered corner, top-right: the Module/01 notch
    path.lineTo(x + width, y + height - notch);
    path.lineTo(x + width - notch, y + height);
  } else {
    path.lineTo(x + width, y + height - radius);
    path.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  }
  path.lineTo(x + radius, y + height);
  path.quadraticCurveTo(x, y + height, x, y + height - radius);
  path.lineTo(x, y + radius);
  path.quadraticCurveTo(x, y, x + radius, y);
  return path;
};

const useGeometries = () => {
  const geometries = useMemo(() => {
    const body = new THREE.ExtrudeGeometry(
      roundedRectPath(new THREE.Shape(), BODY.width, BODY.height, BODY.radius, BODY.notch),
      {
        depth: BODY.depth,
        bevelEnabled: true,
        bevelThickness: BODY.bevel,
        bevelSize: BODY.bevel,
        bevelSegments: 6,
        curveSegments: 24,
      }
    );
    body.translate(0, 0, -BODY.depth / 2);

    const lipShape = roundedRectPath(new THREE.Shape(), SCREEN_WIDTH + 0.22, SCREEN.height + 0.22, 0.16);
    lipShape.holes.push(roundedRectPath(new THREE.Path(), SCREEN_WIDTH + 0.12, SCREEN.height + 0.12, 0.12));
    const lip = new THREE.ExtrudeGeometry(lipShape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 3,
      curveSegments: 16,
    });

    const visor = new THREE.ShapeGeometry(
      roundedRectPath(new THREE.Shape(), SCREEN_WIDTH + 0.14, SCREEN.height + 0.14, 0.12),
      16
    );
    const photo = new THREE.ShapeGeometry(roundedRectPath(new THREE.Shape(), SCREEN_WIDTH, SCREEN.height, 0.08), 16);
    remapUv(photo, SCREEN_WIDTH, SCREEN.height);

    const stand = new THREE.LatheGeometry(
      [
        [0, 0],
        [0.62, 0],
        [0.62, 0.035],
        [0.5, 0.07],
        [0.2, 0.17],
        [0.12, 0.38],
        [0.14, 0.5],
        [0, 0.5],
      ].map(([radius, y]) => new THREE.Vector2(radius, y)),
      64
    );

    return { body, lip, visor, photo, stand };
  }, []);

  useEffect(() => () => Object.values(geometries).forEach((geometry) => geometry.dispose()), [geometries]);
  return geometries;
};

// ShapeGeometry UVs follow shape coordinates; map them to 0–1 across the screen
const remapUv = (geometry: THREE.BufferGeometry, width: number, height: number) => {
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let index = 0; index < position.count; index++) {
    uv.setXY(index, position.getX(index) / width + 0.5, position.getY(index) / height + 0.5);
  }
  uv.needsUpdate = true;
};

const useMaterials = () => {
  const materials = useMemo(
    () => ({
      plastic: new THREE.MeshPhysicalMaterial({ color: color.shell, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12 }),
      signal: new THREE.MeshPhysicalMaterial({ color: color.signal, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.15 }),
      visor: new THREE.MeshPhysicalMaterial({ color: color.visor, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05 }),
      slot: new THREE.MeshStandardMaterial({ color: color.seam, roughness: 0.6 }),
      rod: new THREE.MeshStandardMaterial({ color: color.hudMark, roughness: 0.35, metalness: 0.6 }),
      led: new THREE.MeshStandardMaterial({ color: color.led, emissive: color.led, emissiveIntensity: 0.7 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: color.shell,
        transparent: true,
        opacity: 0.08,
        roughness: 0.05,
        clearcoat: 1,
        depthWrite: false,
      }),
    }),
    []
  );

  useEffect(() => () => Object.values(materials).forEach((material) => material.dispose()), [materials]);
  return materials;
};

const Microprint = ({ text, width }: { text: string; width: number }) => {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 64;
    const created = new THREE.CanvasTexture(canvas);
    created.colorSpace = THREE.SRGBColorSpace;
    return created;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const draw = () => {
      const canvas = texture.image as HTMLCanvasElement;
      const context = canvas.getContext("2d");
      if (!context || cancelled) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = '400 34px "Space Mono", ui-monospace, monospace';
      context.letterSpacing = "6px";
      context.fillStyle = color.hudMark;
      context.textBaseline = "middle";
      context.fillText(text, 0, canvas.height / 2);
      texture.needsUpdate = true;
    };
    draw();
    document.fonts.load('400 34px "Space Mono"').then(draw, () => {});
    return () => {
      cancelled = true;
    };
  }, [text, texture]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh>
      <planeGeometry args={[width, width / 16]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  );
};

type PartGroupProps = {
  part: TvPart;
  exploded: boolean;
  instant: boolean;
  children: ReactNode;
};

const PartGroup = ({ part, exploded, instant, children }: PartGroupProps) => {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;
    const [x, y, z] = exploded ? part.explode : [0, 0, 0];
    if (instant) {
      group.position.set(x, y, z);
      return;
    }
    group.position.set(
      THREE.MathUtils.damp(group.position.x, x, 7, delta),
      THREE.MathUtils.damp(group.position.y, y, 7, delta),
      THREE.MathUtils.damp(group.position.z, z, 7, delta)
    );
  });

  return (
    <group ref={ref}>
      {children}
      {exploded && (
        <Html position={part.balloon} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <span className="m1-tv-balloon m1-hud">{part.code}</span>
        </Html>
      )}
    </group>
  );
};

export type TvModelProps = {
  exploded: boolean;
  instant: boolean;
  screen: THREE.Texture | null;
  onScreenClick?: (event: ThreeEvent<MouseEvent>) => void;
  onKnobClick?: (event: ThreeEvent<MouseEvent>) => void;
};

export const TvModel = ({ exploded, instant, screen, onScreenClick, onKnobClick }: TvModelProps) => {
  const geometry = useGeometries();
  const material = useMaterials();
  const parts = Object.fromEntries(tvParts.map((part) => [part.id, part])) as Record<TvPartId, TvPart>;
  const setCursor = (cursor: string) => () => {
    document.body.style.cursor = cursor;
  };

  return (
    <group>
      <PartGroup part={parts.shell} exploded={exploded} instant={instant}>
        <mesh geometry={geometry.body} material={material.plastic} />
        <group position={[SCREEN.x, SCREEN.y, FRONT_Z]}>
          <mesh geometry={geometry.lip} material={material.plastic} />
        </group>
        <group position={[SCREEN.x, -0.68, FRONT_Z + 0.002]}>
          <Microprint text="MODULE/01 · UNIT-01" width={0.95} />
        </group>
      </PartGroup>

      <PartGroup part={parts.screen} exploded={exploded} instant={instant}>
        <group position={[SCREEN.x, SCREEN.y, FRONT_Z + 0.004]}>
          <mesh geometry={geometry.visor} material={material.visor} />
          <mesh
            geometry={geometry.photo}
            position={[0, 0, 0.004]}
            onClick={onScreenClick}
            onPointerOver={onScreenClick ? setCursor("pointer") : undefined}
            onPointerOut={onScreenClick ? setCursor("") : undefined}
          >
            <meshBasicMaterial map={screen} color={screen ? "#f2f2f2" : color.visor} toneMapped={false} />
          </mesh>
          <mesh geometry={geometry.photo} material={material.glass} position={[0, 0, 0.012]} />
        </group>
      </PartGroup>

      <PartGroup part={parts.trim} exploded={exploded} instant={instant}>
        {[-0.62, 0.02].map((x) => (
          <mesh key={x} position={[x, BODY.height / 2 + BODY.bevel, 0.05]} rotation={[0, 0, Math.PI / 2]} material={material.signal}>
            <capsuleGeometry args={[0.055, 0.26, 8, 16]} />
          </mesh>
        ))}
        <group position={[0.42, BODY.height / 2 + BODY.bevel, -0.1]} rotation={[0, 0, -0.38]}>
          <mesh position={[0, 0.34, 0]} material={material.rod}>
            <cylinderGeometry args={[0.012, 0.016, 0.68, 12]} />
          </mesh>
          <mesh position={[0, 0.7, 0]} material={material.signal}>
            <sphereGeometry args={[0.055, 24, 16]} />
          </mesh>
        </group>
      </PartGroup>

      <PartGroup part={parts.base} exploded={exploded} instant={instant}>
        <mesh
          geometry={geometry.stand}
          material={material.plastic}
          position={[0, -BODY.height / 2 - BODY.bevel - 0.5, 0]}
        />
      </PartGroup>

      <PartGroup part={parts.io} exploded={exploded} instant={instant}>
        <group position={[0.74, 0, FRONT_Z]}>
          <mesh
            position={[0, 0.36, 0.03]}
            rotation={[Math.PI / 2, 0, 0]}
            material={material.signal}
            onClick={onKnobClick}
            onPointerOver={onKnobClick ? setCursor("pointer") : undefined}
            onPointerOut={onKnobClick ? setCursor("") : undefined}
          >
            <cylinderGeometry args={[0.13, 0.13, 0.08, 40]} />
          </mesh>
          <mesh position={[0, 0.44, 0.075]} material={material.rod}>
            <boxGeometry args={[0.016, 0.07, 0.01]} />
          </mesh>
          <mesh position={[0, 0.08, 0.01]} material={material.led}>
            <sphereGeometry args={[0.035, 20, 12]} />
          </mesh>
          {[-0.18, -0.3, -0.42].map((y) => (
            <mesh key={y} position={[0, y, 0.004]} rotation={[0, 0, Math.PI / 2]} material={material.slot}>
              <capsuleGeometry args={[0.028, 0.2, 6, 12]} />
            </mesh>
          ))}
        </group>
      </PartGroup>
    </group>
  );
};

export const TV_FLOOR_Y = -BODY.height / 2 - BODY.bevel - 0.5;
