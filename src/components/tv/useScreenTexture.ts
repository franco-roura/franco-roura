import { useCallback, useEffect, useMemo, useState } from "react";
import * as THREE from "three";

export const SCREEN_ASPECT = 1.3;

// Loads the portrait and centre-crops it to the screen's aspect at a GPU-friendly size
// (the source is 3024px square, far more than a 1.3-unit screen needs).
export const usePhotoTexture = (src: string) => {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let disposed = false;
    let created: THREE.CanvasTexture | null = null;
    const image = new Image();
    image.src = src;

    image
      .decode()
      .then(() => {
        if (disposed) return;
        const width = 1024;
        const height = Math.round(width / SCREEN_ASPECT);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) return;

        const sourceHeight = image.naturalWidth / SCREEN_ASPECT;
        // Bias the crop upward a little to keep the face, which sits above the middle
        const sourceY = (image.naturalHeight - sourceHeight) * 0.35;
        context.drawImage(image, 0, sourceY, image.naturalWidth, sourceHeight, 0, 0, width, height);

        created = new THREE.CanvasTexture(canvas);
        created.colorSpace = THREE.SRGBColorSpace;
        created.flipY = false; // the model's screen UVs follow the glTF convention
        created.anisotropy = 4;
        setTexture(created);
      })
      .catch(() => {});

    return () => {
      disposed = true;
      created?.dispose();
    };
  }, [src]);

  return texture;
};

// Analog static for the moment between channels
export const useStaticNoise = () => {
  const texture = useMemo(() => {
    const width = 96;
    const height = 72;
    const created = new THREE.DataTexture(new Uint8Array(width * height * 4), width, height);
    created.magFilter = THREE.NearestFilter;
    return created;
  }, []);

  const refresh = useCallback(() => {
    const data = texture.image.data as Uint8Array;
    for (let index = 0; index < data.length; index += 4) {
      const value = Math.random() * 255;
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
      data[index + 3] = 255;
    }
    texture.needsUpdate = true;
  }, [texture]);

  useEffect(() => () => texture.dispose(), [texture]);
  return { texture, refresh };
};

// Colour bars in Module/01 tokens with a NO SIGNAL caption, for the 404 page
const BARS = ["#ffffff", "#ffd9c7", "#ff5f1f", "#b9bccd", "#1fa45a", "#53575e", "#1c1e21"];

export const useTestPattern = () => {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = Math.round(1024 / SCREEN_ASPECT);
    const created = new THREE.CanvasTexture(canvas);
    created.colorSpace = THREE.SRGBColorSpace;
    created.flipY = false; // the model's screen UVs follow the glTF convention
    return created;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const draw = () => {
      const canvas = texture.image as HTMLCanvasElement;
      const context = canvas.getContext("2d");
      if (!context || cancelled) return;
      const { width, height } = canvas;
      const barsHeight = height * 0.68;
      const barWidth = width / BARS.length;
      BARS.forEach((color, index) => {
        context.fillStyle = color;
        context.fillRect(Math.floor(index * barWidth), 0, Math.ceil(barWidth), barsHeight);
      });
      context.fillStyle = "#1c1e21";
      context.fillRect(0, barsHeight, width, height - barsHeight);

      // Registration crosshair over the bars
      context.strokeStyle = "#1c1e21";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(width / 2, barsHeight / 2, 70, 0, Math.PI * 2);
      context.moveTo(width / 2 - 110, barsHeight / 2);
      context.lineTo(width / 2 + 110, barsHeight / 2);
      context.moveTo(width / 2, barsHeight / 2 - 110);
      context.lineTo(width / 2, barsHeight / 2 + 110);
      context.stroke();

      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "#ffffff";
      context.font = '700 72px "Space Mono", ui-monospace, monospace';
      context.letterSpacing = "12px";
      context.fillText("NO SIGNAL", width / 2, barsHeight + (height - barsHeight) * 0.42);
      context.fillStyle = "#a3a7ae";
      context.font = '400 26px "Space Mono", ui-monospace, monospace';
      context.letterSpacing = "6px";
      context.fillText("E-404 · UNIT-01 · CH --", width / 2, barsHeight + (height - barsHeight) * 0.78);
      texture.needsUpdate = true;
    };
    draw();
    document.fonts.load('700 72px "Space Mono"').then(draw, () => {});
    return () => {
      cancelled = true;
    };
  }, [texture]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
};
