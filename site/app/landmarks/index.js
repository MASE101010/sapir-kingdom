// Every landmark the kingdom can show. Each is built on the day its winning comment asked for it (data/kingdom.json lists
// which stand, on which lot, and who asked). A landmark module exports { key, name, draw(p), top } and draws around (0,0)
// with its front toward +z; the view moves it onto its lot. The daily run adds one file here and one line below.
import { CASTLE } from './castle.js';
import { BAKERY } from './bakery.js';      // the example: shown only in previews until a winning comment asks for a bakery

export const LANDMARKS = Object.fromEntries([CASTLE, BAKERY].map(l => [l.key, l]));
