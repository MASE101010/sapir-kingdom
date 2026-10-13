// Loads everything the site and the reels share: the frozen plan, the residents, the kingdom's state, the honours.
// Files that change are fetched fresh; the plan is asked for by its bake date, so browsers keep it.
const fresh = async (url, fallback) => { try { const r = await fetch(url, { cache: 'no-store' }); return r.ok ? await r.json() : fallback; } catch { return fallback; } };
export async function loadKingdom(base = '.') {
  const [planMeta, residents, kingdom, honours] = await Promise.all([
    fetch(`${base}/data/plan.json`).then(r => r.json()),
    fresh(`${base}/data/${new URLSearchParams(location.search).has('dev') ? 'dev/' : ''}residents.json`, { residents: [] }),
    fresh(`${base}/data/kingdom.json`, { day: 1, landmarks: [{ key: 'castle', day: 1 }] }),
    fresh(`${base}/data/honours.json`, { given: {}, built: {} }),
  ]);
  return { plan: planMeta, residents: residents.residents, kingdom, honours };
}
/** residents who arrived after the snapshot was baked (the live API, when there is one) */
export async function loadDelta(since) { try { const r = await fetch(`api/delta?since=${since}`, { cache: 'no-store' }); return r.ok ? (await r.json()).residents ?? [] : []; } catch { return []; } }
/** the new residents and the houses their residents changed since the snapshot */
export async function loadLive(since) { try { const r = await fetch(`api/delta?since=${since}`, { cache: 'no-store' }); return r.ok ? await r.json() : {}; } catch { return {}; } }
