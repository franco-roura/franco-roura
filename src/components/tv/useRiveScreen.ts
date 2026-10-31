import { useEffect, useState, type RefObject } from "react";
import * as THREE from "three";
import type { Rive, StateMachineInput } from "@rive-app/canvas-lite";

// The avatar is optional: drop avatar.riv into src/assets/rive (the README there has the
// input contract). Without the file the glob is empty and no Rive code or WASM loads.
const riveFiles = import.meta.glob<string>("../../assets/rive/avatar.riv", {
  query: "?url",
  import: "default",
  eager: true,
});
export const avatarUrl: string | undefined = Object.values(riveFiles)[0];

export type AvatarScreen = {
  rive: Rive;
  texture: THREE.CanvasTexture;
  input: (name: string) => StateMachineInput | undefined;
};

// Renders the avatar into a canvas that the TV screen uses as a texture. The canvas stays
// in the DOM (invisible) because Rive skips drawing to canvases with no layout size.
export const useRiveScreen = (host: RefObject<HTMLElement | null>, enabled: boolean) => {
  const [screen, setScreen] = useState<AvatarScreen | null>(null);

  useEffect(() => {
    const parent = host.current;
    if (!enabled || !avatarUrl || !parent) return;

    let cancelled = false;
    let rive: Rive | null = null;
    let texture: THREE.CanvasTexture | null = null;
    const canvas = document.createElement("canvas");
    canvas.className = "m1-tv-rive-canvas";
    canvas.setAttribute("aria-hidden", "true");
    parent.appendChild(canvas);

    Promise.all([import("@rive-app/canvas-lite"), import("@rive-app/canvas-lite/rive.wasm?url")])
      .then(([{ Rive, RuntimeLoader }, { default: wasmUrl }]) => {
        if (cancelled) return;
        // Serve the WASM from this site instead of Rive's default CDN
        RuntimeLoader.setWasmUrl(wasmUrl);
        const instance = new Rive({
          src: avatarUrl,
          canvas,
          artboard: "Avatar",
          stateMachines: "Avatar",
          autoplay: true,
          shouldDisableRiveListeners: true,
          onLoad: () => {
            if (cancelled) return;
            instance.resizeDrawingSurfaceToCanvas();
            const inputs = instance.stateMachineInputs("Avatar") ?? [];
            texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.flipY = false; // the model's screen UVs follow the glTF convention
            setScreen({
              rive: instance,
              texture,
              input: (name) => inputs.find((input) => input.name === name),
            });
          },
        });
        rive = instance;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      rive?.cleanup();
      texture?.dispose();
      canvas.remove();
    };
  }, [host, enabled]);

  return screen;
};
