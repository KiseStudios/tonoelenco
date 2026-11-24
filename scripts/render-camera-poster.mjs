/** Rebuild with `node scripts/render-camera-poster.mjs` (Blender 4.3+ required). */
import ts from "typescript";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import * as THREE from "three";
import sharp from "sharp";

const temp = resolve(".next/camera-poster");
await mkdir(temp, { recursive: true });
try {
  const source = await readFile("src/components/home/webgl/camera-model.ts", "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  await writeFile(`${temp}/model.mjs`, code);
  const { createCameraModel } = await import(pathToFileURL(`${temp}/model.mjs`).href);
  const model = createCameraModel();
  model.camera.updateMatrixWorld(true);
  const meshes = [];
  model.camera.traverse((object) => {
    if (!object.isMesh) return;
    const count = object.isInstancedMesh ? object.count : 1;
    for (let instance = 0; instance < count; instance++) {
      const transform = object.matrixWorld.clone();
      if (object.isInstancedMesh) {
        const local = new THREE.Matrix4();
        object.getMatrixAt(instance, local);
        transform.multiply(local);
      }
      const position = object.geometry.attributes.position;
      const vertices = [];
      for (let i = 0; i < position.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(position, i).applyMatrix4(transform);
        vertices.push([v.x, -v.z, v.y]);
      }
      const indices = object.geometry.index?.array ?? Array.from({ length: position.count }, (_, i) => i);
      const faces = [];
      for (let i = 0; i < indices.length; i += 3) faces.push([indices[i], indices[i + 1], indices[i + 2]]);
      const m = object.material;
      meshes.push({ vertices, faces, color: m.color.toArray(), roughness: m.roughness, metalness: m.metalness, transmission: m.transmission ?? 0 });
    }
  });
  await writeFile(`${temp}/model.json`, JSON.stringify(meshes));
  model.dispose();
  execFileSync("blender", ["--background", "--threads", "4", "--python", "scripts/render-camera-poster.py", "--", `${temp}/model.json`, `${temp}/poster.png`], { stdio: "inherit" });
  await sharp(`${temp}/poster.png`).webp({ quality: 92, alphaQuality: 100 }).toFile("public/images/camera-studio.webp");
} finally {
  await rm(temp, { recursive: true, force: true });
}
