// 3D models made outside the code (day 11): a GLB file, for example one made from a picture with an image-to-3D tool, put
// into the kingdom and the reels like any landmark. place() stands it on the ground at { at: [x, y, z] }, scales it to
// h metres tall, turns it ry radians, lets it cast and take shadows, and makes its materials sit in the kingdom's light.
// Files live in site/models/. A reel waits for every model to load before its first frame (ready()).
import * as THREE from 'three';
import { GLTFLoader } from '../vendor/addons/GLTFLoader.js';

const loader = new GLTFLoader(), cache = new Map(), pending = [];
const load = url => cache.get(url) ?? cache.set(url, loader.loadAsync(url)).get(url);

/** puts the model at url into parent; returns its holder group at once (the model appears inside it when loaded) */
export function place(parent, url, { at = [0, 0, 0], h = null, ry = 0, key = null } = {}) {
  const holder = new THREE.Group(); holder.name = key ?? url; holder.position.set(...at); holder.rotation.y = ry; parent.add(holder);
  const job = load(url).then(gltf => {
    const m = gltf.scene.clone(true);
    m.traverse(o => { if (!o.isMesh) return; o.castShadow = o.receiveShadow = true; if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();   // some exporters leave the normals out: unlit black
      // image-to-3D models come with physical materials made for an environment map; the kingdom has sun and sky only,
      // so they would look dark and grey: keep their colour map, light them the kingdom's way
      const old = o.material; if (old && !Array.isArray(old) && old.isMeshStandardMaterial) { o.material = new THREE.MeshLambertMaterial({ map: old.map ?? null, color: old.map ? 0xffffff : old.color, vertexColors: !!o.geometry.attributes.color, transparent: old.transparent, alphaTest: old.alphaTest }); old.dispose(); } });
    const box = new THREE.Box3().setFromObject(m), size = box.getSize(new THREE.Vector3()), k = h ? h / Math.max(size.y, 1e-6) : 1;
    m.scale.setScalar(k); box.setFromObject(m); const c = box.getCenter(new THREE.Vector3());
    m.position.set(-c.x, -box.min.y, -c.z); holder.add(m); holder.userData.ok = true; holder.userData.size = box.getSize(new THREE.Vector3()); return holder;
  }).catch(e => { console.warn('model', url, e.message); return holder; });
  holder.userData.job = job; pending.push(job); return holder;
}
/** resolves when every model asked for so far has loaded (or failed) */
export const ready = () => Promise.all(pending);
/** anything else a frame must wait for (a picture on a landmark): the reel's first frame waits for it too */
export const track = job => { pending.push(job.catch(() => null)); return job; };
