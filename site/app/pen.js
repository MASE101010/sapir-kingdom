// The Pen: draws with a handful of simple shapes and collects them into one instanced mesh per shape.
// Houses, trees, the castle and every landmark are drawn with it, so tens of thousands of parts cost a few draw calls.
// p.at(x, z, rot, y) moves the pen (rot turns +z, the front, toward the road); every shape after that is relative to it.
// p.mark() remembers how many of each shape exist, so a reel can show the first n houses by setting mesh counts.
import * as THREE from 'three';

function gableGeometry() {            // a roof: one unit wide (x), one deep (z), one high, ridge along z
  const g = new THREE.BufferGeometry();
  const v = [-.5,0,-.5, .5,0,-.5, 0,1,-.5,  -.5,0,.5, 0,1,.5, .5,0,.5,
    -.5,0,-.5, 0,1,-.5, 0,1,.5,  -.5,0,-.5, 0,1,.5, -.5,0,.5,
    .5,0,-.5, .5,0,.5, 0,1,.5,  .5,0,-.5, 0,1,.5, 0,1,-.5];
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.computeVertexNormals(); return g;
}
const unit = g => { g.translate(0, .5, 0); return g; };
export const SHAPES = {
  box: () => unit(new THREE.BoxGeometry(1, 1, 1)),
  gable: gableGeometry,
  cyl: () => unit(new THREE.CylinderGeometry(.5, .5, 1, 10)),
  cone: () => unit(new THREE.ConeGeometry(.5, 1, 10)),
  pyramid: () => unit(new THREE.ConeGeometry(.5 * Math.SQRT2, 1, 4).rotateY(Math.PI / 4)),
  ball: () => new THREE.IcosahedronGeometry(.5, 0).translate(0, .5, 0),
};

export class Pen {
  constructor() { this.parts = Object.fromEntries(Object.keys(SHAPES).map(k => [k, []])); this.o = { x: 0, z: 0, c: 1, s: 0, y: 0 }; }
  at(x, z, rot = 0, y = 0) { this.o = { x, z, c: Math.cos(rot), s: Math.sin(rot), y, rot }; return this; }
  /** a shape: centre of its base at local (x, y, z), size w × h × d, turned by r about its own up axis */
  add(kind, x, y, z, w, h, d, color, r = 0) {
    const o = this.o, wx = o.x + x * o.c + z * o.s, wz = o.z - x * o.s + z * o.c;
    this.parts[kind].push(wx, o.y + y, wz, w, h, d, (o.rot ?? 0) + r, color);
    return this;
  }
  box(x, y, z, w, h, d, color, r) { return this.add('box', x, y, z, w, h, d, color, r); }
  gable(x, y, z, w, h, d, color, r) { return this.add('gable', x, y, z, w, h, d, color, r); }
  cyl(x, y, z, w, h, color) { return this.add('cyl', x, y, z, w, h, w, color); }
  cone(x, y, z, w, h, color) { return this.add('cone', x, y, z, w, h, w, color); }
  pyramid(x, y, z, w, h, color, r) { return this.add('pyramid', x, y, z, w, h, w, color, r); }
  ball(x, y, z, w, h, color) { return this.add('ball', x, y, z, w, h, w, color); }
  tree(x, z, size = 1, leaf = 0x4f9a43) { this.cyl(x, 0, z, .5 * size, 2.2 * size, 0x7a5a3a); this.ball(x, 1.8 * size, z, 3.6 * size, 3.6 * size, leaf); return this; }
  mark() { return Object.fromEntries(Object.entries(this.parts).map(([k, a]) => [k, a.length / 8])); }

  /** turns everything drawn into meshes, added to a group */
  build(group = new THREE.Group(), { shadows = true } = {}) {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), col = new THREE.Color();
    this.meshes = {};
    for (const [kind, a] of Object.entries(this.parts)) {
      const n = a.length / 8; if (!n) continue;
      const mesh = new THREE.InstancedMesh(SHAPES[kind](), new THREE.MeshLambertMaterial({ side: kind === 'gable' ? THREE.DoubleSide : THREE.FrontSide }), n);
      for (let i = 0; i < n; i++) {
        const j = i * 8; q.setFromAxisAngle(up, a[j + 6]);
        m.compose(new THREE.Vector3(a[j], a[j + 1], a[j + 2]), q, new THREE.Vector3(a[j + 3], a[j + 4], a[j + 5]));
        mesh.setMatrixAt(i, m); mesh.setColorAt(i, col.setHex(a[j + 7]));
      }
      mesh.castShadow = shadows; mesh.receiveShadow = true; mesh.frustumCulled = false;
      group.add(mesh); this.meshes[kind] = mesh;
    }
    return group;
  }
  /** shows only what was drawn before a mark (a reel's houses appearing one by one) */
  showUpTo(mark) { for (const [k, mesh] of Object.entries(this.meshes)) mesh.count = mark ? (mark[k] ?? 0) : mesh.instanceMatrix.count; }
}
