import * as THREE from "three";
import { proxy } from "valtio";

export const damp = THREE.MathUtils.damp;
export const state = proxy({
  clicked: null,
  urls: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(
    (u) => `/${u}.jpg`
  ),
});
