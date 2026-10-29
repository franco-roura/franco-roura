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
