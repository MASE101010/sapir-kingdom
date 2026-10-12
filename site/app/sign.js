// Painted signs for landmarks: a flat board with Hebrew lettering, drawn on a canvas texture.
// A landmark adds them in its live(group, THREE): group.add(sign('שוק הממלכה', { w: 20, h: 4 }).at(0, 12, 10.2)).
// The board faces +z (the landmark's front). The text is drawn again once the fonts have loaded, so it is never a fallback face.
import * as THREE from 'three';

export function sign(text, { w = 16, h = 3.6, bg = '#fffaf0', fg = '#13213b', border = '#13213b', font = '800 {px}px Rubik', both = false } = {}) {
  const px = 64, c = document.createElement('canvas'); c.width = Math.round(w * px / 2); c.height = Math.round(h * px / 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const paint = () => {
    const g = c.getContext('2d'), b = Math.max(4, c.height * .07);
    g.fillStyle = border; g.fillRect(0, 0, c.width, c.height); g.fillStyle = bg; g.fillRect(b, b, c.width - 2 * b, c.height - 2 * b);
    let size = c.height * .62; g.font = font.replace('{px}', size); g.direction = 'rtl'; g.textAlign = 'center'; g.textBaseline = 'middle';
    while (g.measureText(text).width > c.width - 4 * b && size > 8) { size -= 2; g.font = font.replace('{px}', size); }
    g.fillStyle = fg; g.fillText(text, c.width / 2, c.height * .54); tex.needsUpdate = true;
  };
  paint(); document.fonts?.load(font.replace('{px}', 40)).then(paint).catch(() => {});
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, side: both ? THREE.DoubleSide : THREE.FrontSide }));
  mesh.at = (x, y, z, rotY = 0) => { mesh.position.set(x, y, z); mesh.rotation.y = rotY; return mesh; };
  return mesh;
}
