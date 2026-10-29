import { useEffect, useMemo } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { nodeExplode, tvParts } from "./parts";

// Modeled in Blender: separate shells, bevels and a baked ambient-occlusion atlas on the
// second UV set. Materials are set here from the Module/01 tokens, matched by name.
const MODEL_URL = "/models/tv.glb";
const AO_URL = "/models/tv-ao.webp";
const DRACO_PATH = "/draco/";
export const TV_FLOOR_Y = -1.2;

const VISOR = "#1c1e21";
const LED = "#1fa45a";

useGLTF.preload(MODEL_URL, DRACO_PATH);

const configureAo = (texture: THREE.Texture | THREE.Texture[]) => {
  for (const map of Array.isArray(texture) ? texture : [texture]) {
    map.flipY = false; // glTF UV convention
    map.channel = 1; // the "AO" UV map
    map.colorSpace = THREE.NoColorSpace;
  }
};

const useMaterials = (ao: THREE.Texture) => {
  const materials = useMemo(() => {
    const physical = (params: THREE.MeshPhysicalMaterialParameters) =>
      new THREE.MeshPhysicalMaterial({ aoMap: ao, ...params });
    const set: Record<string, THREE.Material> = {
      M1_Shell: physical({ color: "#ffffff", roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.1 }),
      M1_Satin: physical({ color: "#a9aeb7", roughness: 0.48 }),
      M1_Charcoal: physical({ color: "#2a2d31", roughness: 0.4 }),
      M1_Signal: physical({ color: "#ff5f1f", roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.15 }),
      M1_Rubber: physical({ color: VISOR, roughness: 0.85 }),
      M1_Metal: physical({ color: "#9aa0a8", roughness: 0.25, metalness: 1 }),
      M1_LED: new THREE.MeshStandardMaterial({ color: LED, emissive: LED, emissiveIntensity: 0.8 }),
      M1_Glass: new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.08,
        roughness: 0.05,
        clearcoat: 1,
        depthWrite: false,
      }),
      M1_Screen: new THREE.MeshBasicMaterial({ color: VISOR, toneMapped: false }),
    };
    for (const [name, material] of Object.entries(set)) material.name = name;
    return set;
  }, [ao]);

  useEffect(() => () => Object.values(materials).forEach((material) => material.dispose()), [materials]);
  return materials;
};

type MovingNode = {
  object: THREE.Object3D;
  rest: THREE.Vector3;
  offset: THREE.Vector3;
};

export type TvModelProps = {
  exploded: boolean;
  instant: boolean;
  screen: THREE.Texture | null;
  onScreenClick?: (event: ThreeEvent<MouseEvent>) => void;
  onKnobClick?: (event: ThreeEvent<MouseEvent>) => void;
  onLoaded?: () => void;
};

export const TvModel = ({ exploded, instant, screen, onScreenClick, onKnobClick, onLoaded }: TvModelProps) => {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);
  const ao = useTexture(AO_URL, configureAo);
  const materials = useMaterials(ao);
  const screenMaterial = materials.M1_Screen as THREE.MeshBasicMaterial;

  // Swap in the token materials, and note where every part sits when assembled
  const nodes = useMemo(() => {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const name = (object.material as THREE.Material).name;
      object.material = materials[name] ?? object.material;
      if (name === "M1_Glass") object.raycast = () => {};
    });

    const moving: MovingNode[] = [];
    for (const part of tvParts) {
      scene.getObjectByName(part.id)?.children.forEach((child) => {
        child.userData.rest ??= child.position.clone();
        moving.push({
          object: child,
          rest: child.userData.rest,
          offset: new THREE.Vector3(...(nodeExplode[child.name] ?? part.explode)),
        });
      });
    }
    return moving;
  }, [scene, materials]);

  useEffect(() => {
    screenMaterial.map = screen;
    screenMaterial.color.set(screen ? "#f2f2f2" : VISOR);
    screenMaterial.needsUpdate = true;
  }, [screen, screenMaterial]);

  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, delta) => {
    for (const node of nodes) {
      target.copy(node.rest);
      if (exploded) target.add(node.offset);
      const position = node.object.position;
      if (instant) {
        position.copy(target);
        continue;
      }
      position.set(
        THREE.MathUtils.damp(position.x, target.x, 7, delta),
        THREE.MathUtils.damp(position.y, target.y, 7, delta),
        THREE.MathUtils.damp(position.z, target.z, 7, delta)
      );
    }
  });

  const interactive = (name: string) =>
    (name === "screen_display" && onScreenClick !== undefined) || (name.startsWith("io_knob") && onKnobClick !== undefined);

  return (
    <group>
      <primitive
        object={scene}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          const name = event.object.name;
          if (name === "screen_display") onScreenClick?.(event);
          else if (name.startsWith("io_knob")) onKnobClick?.(event);
        }}
        onPointerMove={(event: ThreeEvent<PointerEvent>) => {
          document.body.style.cursor = interactive(event.object.name) ? "pointer" : "";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      />
      {exploded &&
        tvParts.map((part) => (
          <Html key={part.id} position={part.balloon} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
            <span className="m1-tv-balloon m1-hud">{part.code}</span>
          </Html>
        ))}
    </group>
  );
};
