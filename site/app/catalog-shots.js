// ?catalog: draws every house of the catalogue alone on a lawn and hands back pictures (tools/catalog.mjs saves them
// as site/catalog/k.png for the catalogue page). Each is shown as the resident's house would be: a fixed sample name.
import * as THREE from 'three';
import { Pen } from './pen.js';
import { HOMES } from './homes.js';
import { fingerprint } from './residents.js';
export async function startCatalog(renderer) {
  const W = 320; renderer.setSize(W, W);
  window.__catalog = HOMES.map((draw, k) => {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0xcfe8f3);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb7c99a, 1.3)); const sun = new THREE.DirectionalLight(0xfff4e0, 2); sun.position.set(-20, 40, 30); sun.castShadow = true; scene.add(sun);
    const ground = new THREE.Mesh(new THREE.CircleGeometry(14, 40), new THREE.MeshLambertMaterial({ color: 0x86c766 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    const p = new Pen(); draw(p, fingerprint(`sample${k}`), 1); scene.add(p.build());
    const cam = new THREE.PerspectiveCamera(32, 1, 1, 500), top = [6, 6, 8, 6, 14, 20, 24, 10][k] ?? 8, back = top > 15 ? 1.35 : 1;
    cam.position.set(16 * back, 10 + top * .6, 22 * back); cam.lookAt(0, top * .45, 0);
    renderer.render(scene, cam); return renderer.domElement.toDataURL('image/png');
  });
  document.body.dataset.ready = '1';
}
