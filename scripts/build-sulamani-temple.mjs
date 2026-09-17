/**
 * Builds a stylized, web-sized Sulamani (Bagan) temple GLB.
 * Architectural massing only — not a photogrammetry scan.
 * Run: node scripts/build-sulamani-temple.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// GLTFExporter still uses FileReader to flatten the binary blob.
if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    result = null;
    onload = null;
    onloadend = null;
    onerror = null;
    readAsArrayBuffer(blob) {
      blob
        .arrayBuffer()
        .then((buffer) => {
          this.result = buffer;
          const event = { target: this };
          this.onload?.(event);
          this.onloadend?.(event);
        })
        .catch((error) => this.onerror?.(error));
    }
  };
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "models", "sulamani-temple.glb");

const PALETTE = {
  brick: 0xc4a07a,
  brickDeep: 0xa67b55,
  stucco: 0xd8c09a,
  recess: 0x8a6244,
  gold: 0xc59b27,
};

function mat(hex, extras = {}) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    roughness: extras.roughness ?? 0.82,
    metalness: extras.metalness ?? 0.04,
    ...extras,
  });
}

function box(w, h, d, x, y, z) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g;
}

function cyl(rTop, rBot, h, x, y, z, segs = 16) {
  const g = new THREE.CylinderGeometry(rTop, rBot, h, segs);
  g.translate(x, y, z);
  return g;
}

function cone(r, h, x, y, z, segs = 12) {
  const g = new THREE.ConeGeometry(r, h, segs);
  g.translate(x, y, z);
  return g;
}

function sphere(r, x, y, z, segs = 12) {
  const g = new THREE.SphereGeometry(r, segs, segs);
  g.translate(x, y, z);
  return g;
}

function merge(list) {
  const valid = list.filter(Boolean);
  const m = mergeGeometries(valid, false);
  valid.forEach((g) => g.dispose());
  return m;
}

function porch(geoms, angle, reach) {
  const g = new THREE.Group();
  const hall = box(0.52, 0.62, 0.42, 0, 0.49, reach);
  const roof = box(0.6, 0.08, 0.48, 0, 0.84, reach);
  const ped = cone(0.34, 0.22, 0, 0.98, reach, 4);
  ped.rotateY(Math.PI / 4);
  const door = box(0.22, 0.42, 0.08, 0, 0.42, reach + 0.2);
  [hall, roof, ped].forEach((geom) => {
    geom.rotateY(angle);
    geoms.brick.push(geom);
  });
  door.rotateY(angle);
  geoms.recess.push(door);
  return g;
}

function cornerStupa(geoms, x, z, y, scale = 1) {
  geoms.stucco.push(
    cyl(0.07 * scale, 0.09 * scale, 0.06 * scale, x, y + 0.03 * scale, z, 10),
    cyl(0.05 * scale, 0.07 * scale, 0.08 * scale, x, y + 0.1 * scale, z, 10),
    sphere(0.055 * scale, x, y + 0.16 * scale, z, 10),
  );
  geoms.gold.push(cone(0.028 * scale, 0.14 * scale, x, y + 0.26 * scale, z, 8));
}

function sikhara(geoms, y0) {
  const tiers = [
    [0.42, 0.12],
    [0.34, 0.11],
    [0.27, 0.1],
    [0.21, 0.1],
    [0.16, 0.1],
    [0.12, 0.12],
  ];
  let y = y0;
  for (const [w, h] of tiers) {
    geoms.brick.push(box(w, h, w, 0, y + h / 2, 0));
    geoms.stucco.push(box(w + 0.04, 0.03, w + 0.04, 0, y + h + 0.01, 0));
    y += h + 0.025;
  }
  geoms.stucco.push(
    cyl(0.055, 0.09, 0.1, 0, y + 0.05, 0, 14),
    sphere(0.08, 0, y + 0.14, 0, 14),
    cyl(0.03, 0.05, 0.08, 0, y + 0.24, 0, 12),
  );
  geoms.gold.push(
    cyl(0.07, 0.07, 0.012, 0, y + 0.29, 0, 12),
    cyl(0.05, 0.05, 0.01, 0, y + 0.31, 0, 12),
    cyl(0.03, 0.03, 0.01, 0, y + 0.33, 0, 12),
    cone(0.018, 0.16, 0, y + 0.42, 0, 8),
  );
}

function buildTemple() {
  const geoms = { brick: [], brickDeep: [], stucco: [], recess: [], gold: [] };

  // Plinth and steps
  geoms.brickDeep.push(box(2.35, 0.12, 2.35, 0, 0.06, 0));
  geoms.brick.push(box(2.15, 0.1, 2.15, 0, 0.16, 0));
  for (const a of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]) {
    const step = box(0.7, 0.08, 0.28, 0, 0.04, 1.22);
    step.rotateY(a);
    geoms.stucco.push(step);
  }

  // Lower storey
  geoms.brick.push(box(1.55, 0.78, 1.55, 0, 0.6, 0));
  geoms.stucco.push(box(1.62, 0.07, 1.62, 0, 1.02, 0));

  // Pilasters + recessed bays on four faces
  for (const a of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]) {
    for (const side of [-0.48, 0.48]) {
      const pil = box(0.1, 0.72, 0.08, side, 0.58, 0.8);
      pil.rotateY(a);
      geoms.stucco.push(pil);
    }
    const bay = box(0.28, 0.38, 0.06, 0, 0.52, 0.8);
    bay.rotateY(a);
    geoms.recess.push(bay);
    porch(geoms, a, 1.02);
  }

  // Upper storey
  geoms.brick.push(box(1.18, 0.58, 1.18, 0, 1.36, 0));
  geoms.stucco.push(box(1.26, 0.06, 1.26, 0, 1.68, 0));
  for (const a of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]) {
    const window = box(0.18, 0.26, 0.06, 0, 1.34, 0.61);
    window.rotateY(a);
    geoms.recess.push(window);
  }

  // Receding terraces
  const terraces = [
    { w: 1.42, h: 0.09, y: 1.76 },
    { w: 1.22, h: 0.08, y: 1.88 },
    { w: 1.02, h: 0.08, y: 1.99 },
    { w: 0.84, h: 0.07, y: 2.1 },
  ];
  terraces.forEach((t, i) => {
    geoms.brick.push(box(t.w, t.h, t.w, 0, t.y, 0));
    geoms.stucco.push(box(t.w + 0.05, 0.025, t.w + 0.05, 0, t.y + t.h / 2 + 0.01, 0));
    if (i < 3) {
      const inset = t.w / 2 - 0.08;
      cornerStupa(geoms, inset, inset, t.y + t.h, 0.72 - i * 0.12);
      cornerStupa(geoms, -inset, inset, t.y + t.h, 0.72 - i * 0.12);
      cornerStupa(geoms, inset, -inset, t.y + t.h, 0.72 - i * 0.12);
      cornerStupa(geoms, -inset, -inset, t.y + t.h, 0.72 - i * 0.12);
    }
  });

  sikhara(geoms, 2.18);

  const materials = {
    brick: mat(PALETTE.brick),
    brickDeep: mat(PALETTE.brickDeep, { roughness: 0.88 }),
    stucco: mat(PALETTE.stucco, { roughness: 0.74 }),
    recess: mat(PALETTE.recess, { roughness: 0.9 }),
    gold: mat(PALETTE.gold, { roughness: 0.32, metalness: 0.62 }),
  };

  const group = new THREE.Group();
  group.name = "SulamaniTemple";

  for (const [key, list] of Object.entries(geoms)) {
    if (!list.length) continue;
    const mesh = new THREE.Mesh(merge(list), materials[key]);
    mesh.name = key;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  return group;
}

const scene = new THREE.Scene();
scene.add(buildTemple());

const exporter = new GLTFExporter();
const data = await exporter.parseAsync(scene, { binary: true });
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, Buffer.from(data));
console.log(`Wrote ${OUT} (${data.byteLength} bytes)`);
