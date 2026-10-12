// The narration of a day's reel, in Michael's voice (ElevenLabs). One request per line, with timings for every letter;
// writes site/episodes/dayN.mp3 and site/episodes/dayN.voice.json ({ lines: [{start, end}], words: [{w, start, end, line}] }),
// which reel.js uses so the camera, the cards and the captions follow the voice.
// env: ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID   node reel/voice.mjs --day 3
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const day = +process.argv[process.argv.indexOf('--day') + 1], GAP = .35;
const ep = JSON.parse(readFileSync(`site/episodes/day${day}.json`, 'utf8'));
const { ELEVENLABS_API_KEY: key, ELEVENLABS_VOICE_ID: voice, ELEVENLABS_MODEL: model = 'eleven_v3' } = process.env;
mkdirSync('out/voice', { recursive: true });
const lines = [], words = []; let t = .4; const parts = [];
for (const [i, text] of ep.lines.entries()) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST', headers: { 'xi-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify({ text, model_id: model, language_code: 'he', voice_settings: { stability: .45, similarity_boost: .8, style: .35 } }) });
  if (!r.ok) throw new Error(`line ${i}: ${r.status} ${await r.text()}`);
  const d = await r.json(), file = `out/voice/day${day}-${i}.mp3`; writeFileSync(file, Buffer.from(d.audio_base64, 'base64'));
  const a = d.alignment, chars = a.characters, st = a.character_start_times_seconds, en = a.character_end_times_seconds;
  // words: runs of letters outside [tags]
  let inTag = false, cur = null;
  chars.forEach((c, k) => { if (c === '[') inTag = true; if (inTag) { if (c === ']') inTag = false; cur = null; return; }
    if (/\s/.test(c)) { cur = null; return; } if (!cur) { cur = { w: '', start: t + st[k], end: t + en[k], line: i }; words.push(cur); } cur.w += c; cur.end = t + en[k]; });
  const len = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString();
  lines.push({ start: t, end: t + len }); parts.push({ file, at: t }); t += len + GAP;
  console.log(`${i}: ${len.toFixed(2)} s  ${text}`);
}
// one track: each line at its start time
const inputs = parts.flatMap(p => ['-i', p.file]), delays = parts.map((p, i) => `[${i}]adelay=${Math.round(p.at * 1000)}:all=1[a${i}]`).join(';');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', `${delays};${parts.map((_, i) => `[a${i}]`).join('')}amix=inputs=${parts.length}:normalize=0,apad=pad_dur=2`, '-c:a', 'libmp3lame', '-b:a', '192k', `site/episodes/day${day}.mp3`]);
writeFileSync(`site/episodes/day${day}.voice.json`, JSON.stringify({ lines, words }));
console.log(`site/episodes/day${day}.mp3, ${t.toFixed(1)} s`);
