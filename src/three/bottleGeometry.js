/**
 * Procedural Goli Soda bottle profile — points for THREE.LatheGeometry.
 * When you swap in a .glb, the same component API stays the same;
 * we just replace these procedural meshes with parsed GLB nodes.
 *
 * Each profile is an array of [radius, height] pairs, scaled in
 * "bottle units" where the body is ~3.2 tall.
 */
import * as THREE from 'three'

const toVec2 = (pts) => pts.map(([x, y]) => new THREE.Vector2(x, y))

/* Outer glass bottle profile — full Codd-neck shape */
export const BOTTLE_PROFILE = toVec2([
  [0.001, 0.00],
  [0.560, 0.00],
  [0.605, 0.06],
  [0.620, 0.18],
  [0.620, 1.70],
  [0.555, 1.85],
  [0.420, 2.00],
  [0.318, 2.12],
  [0.280, 2.25],
  [0.272, 2.45],
  [0.300, 2.55],   // marble chamber bulge start
  [0.330, 2.62],   // widest of marble chamber
  [0.300, 2.72],
  [0.275, 2.80],
  [0.270, 3.10],
  [0.300, 3.15],
  [0.300, 3.20],
  [0.265, 3.22],
])

/* Liquid fill profile — sits inside the body, surface at top */
export const LIQUID_PROFILE = toVec2([
  [0.001, 0.04],
  [0.535, 0.04],
  [0.580, 0.12],
  [0.598, 0.22],
  [0.598, 1.55],
  [0.380, 1.62],
  [0.001, 1.62],
])

/* Cap profile — Codd-style top closure */
export const CAP_PROFILE = toVec2([
  [0.001, 3.20],
  [0.300, 3.20],
  [0.320, 3.24],
  [0.320, 3.42],
  [0.300, 3.44],
  [0.001, 3.44],
])

/* Standalone position constants */
export const MARBLE_Y     = 2.62    // y-coord where marble sits in chamber
export const MARBLE_R     = 0.16
export const LABEL_Y      = 0.90
export const LABEL_HEIGHT = 0.70
export const LABEL_R      = 0.626   // just outside body radius

/* Resting (assembled) positions/rotations of each part */
export const REST = {
  body:   { position: [0, -1.6, 0],          rotation: [0, 0, 0] },
  liquid: { position: [0, -1.6, 0],          rotation: [0, 0, 0] },
  marble: { position: [0, MARBLE_Y - 1.6, 0], rotation: [0, 0, 0] },
  cap:    { position: [0, -1.6, 0],          rotation: [0, 0, 0] },
  label:  { position: [0, LABEL_Y - 1.6, 0],  rotation: [0, 0, 0] },
}
