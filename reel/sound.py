"""The reel's sound: background music and sound effects, made in code (no samples, no paid service), mixed under the
voice. Reads site/episodes/dayN.json ("music", "sfx") and the voice timings (dayN.voice.json), writes dayN.mix.mp3.
   python3 reel/sound.py --day 2
music: { "bpm": 112, "sections": [[from_s, "happy" | "tense" | "stop"], ...] } (times in seconds, or {"line": n, "dt": s})
sfx:   [{ "name": "roar", "line": 4, "dt": 0.2, "gain": 1, "repeat": 1, "every": 0.15 }, ...]
names: whoosh, pop, ding, roar, sting, boom, scratch, boing, cricket, kaching, sparkle, snore, tada
The music ducks under the voice by itself (it follows the loudness of the voice)."""
import json, subprocess, sys, numpy as np

SR = 44100
day = int(sys.argv[sys.argv.index('--day') + 1])
ep = json.load(open(f'site/episodes/day{day}.json'))
voice_t = json.load(open(f'site/episodes/day{day}.voice.json'))
line_at = lambda n, dt=0: voice_t['lines'][max(0, min(n, len(voice_t['lines']) - 1))]['start'] + dt
when = lambda s: s if isinstance(s, (int, float)) else line_at(s.get('line', 0), s.get('dt', 0))
rng = np.random.default_rng(7)

def read_mp3(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)

voice = read_mp3(f'site/episodes/day{day}.mp3')
total = max(len(voice) / SR, float(ep.get('duration', 0))) + .5
N = int(total * SR)
t_all = np.arange(N) / SR

def env(n, a=.005, d=.2, s=0., r=0.):
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / max(d, 1e-4))
    return e
def tone(f, dur, kind='sine', a=.005, d=.3):
    n = int(dur * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(np.broadcast_to(f, (n,)) if np.ndim(f) else np.full(n, f)) / SR
    w = {'sine': np.sin(ph), 'tri': 2 / np.pi * np.arcsin(np.sin(ph)), 'saw': 2 * ((ph / (2 * np.pi)) % 1) - 1, 'square': np.sign(np.sin(ph))}[kind]
    return w * env(n, a, d)
def noise(dur): return rng.standard_normal(int(dur * SR))
def lowpass(x, cut):
    if np.ndim(cut) == 0:
        from scipy.signal import lfilter
        a = np.exp(-2 * np.pi * cut / SR); return lfilter([1 - a], [1, -a], x)
    a = np.exp(-2 * np.pi * np.asarray(cut) / SR); y = np.zeros_like(x); s = 0.
    aa = np.broadcast_to(a, x.shape)
    for i in range(len(x)): s = aa[i] * s + (1 - aa[i]) * x[i]; y[i] = s
    return y
def norm(x, peak=.9): m = np.max(np.abs(x)) or 1; return x / m * peak

# ---- sound effects ----
def sfx_whoosh():
    d = .55; n = noise(d); t = np.arange(len(n)) / SR; cut = 300 + 5000 * np.sin(np.pi * t / d) ** 2
    return norm(lowpass(n, cut) * np.sin(np.pi * t / d) ** 2, .6)
def sfx_pop():
    d = .12; t = np.arange(int(d * SR)) / SR; f = 900 * np.exp(-t * 30) + 300
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 35), .5)
def sfx_ding():
    return norm(sum(tone(f, 1.4, 'sine', .002, .5) * g for f, g in [(1568, 1), (3136, .4), (2349, .3)]), .45)
def sfx_sparkle():
    out = np.zeros(int(1.2 * SR))
    for i, f in enumerate([2093, 2637, 3136, 4186, 3520, 2637, 4186]):
        s = tone(f, .5, 'sine', .002, .15) * .5; o = int(i * .08 * SR); out[o:o + len(s)] += s[:len(out) - o]
    return norm(out, .4)
def sfx_tada():
    out = np.zeros(int(1.6 * SR))
    for o, chord in [(0, [523, 659, 784]), (.18, [784, 988, 1175, 1568])]:
        for f in chord:
            s = (tone(f, 1.4 - o, 'saw', .01, .6) * .5 + tone(f * 2, 1.4 - o, 'sine', .01, .5) * .3); s = lowpass(s, 3500); i = int(o * SR); out[i:i + len(s)] += s
    return norm(out, .55)
def sfx_kaching():
    t = np.arange(int(.08 * SR)) / SR; click = noise(.08) * np.exp(-t * 80) * .6
    bell = sum(tone(f, 1.2, 'sine', .001, .4) * g for f, g in [(2637, 1), (3951, .6), (5274, .3)])
    out = np.zeros(int(1.3 * SR)); out[:len(click)] += click; out[int(.06 * SR):int(.06 * SR) + len(bell)] += bell[:len(out) - int(.06 * SR)]
    return norm(out, .5)
def sfx_roar():
    d = 1.8; t = np.arange(int(d * SR)) / SR; f = 70 + 25 * np.sin(2 * np.pi * 6 * t) + 40 * np.exp(-t * 2)
    body = tone(f, d, 'saw', .08, 1.2) + .6 * tone(f * 1.5, d, 'saw', .08, 1.0)
    grit = lowpass(noise(d), 900) * 1.5 * np.exp(-t * 1.2)
    return norm(lowpass(body + grit, 1600) * np.minimum(1, t / .1), .8)
def sfx_boom():
    d = 1.6; t = np.arange(int(d * SR)) / SR; f = 55 * np.exp(-t * 1.5) + 30
    return norm(tone(f, d, 'sine', .002, .7) + lowpass(noise(d), 400) * np.exp(-t * 6) * .8, .9)
def sfx_sting():                                    # dun, dun, duuun: three low brass hits, the last one long
    out = np.zeros(int(2.4 * SR))
    for o, f, dd in [(0, 98, .35), (.38, 92.5, .35), (.76, 87.3, 1.5)]:
        s = sum(tone(f * m, dd + .4, 'saw', .01, dd) * g for m, g in [(1, 1), (2, .5), (1.5, .4)]); s = lowpass(s, 1200); i = int(o * SR); out[i:i + len(s)] += s[:len(out) - i]
    return norm(out + np.pad(sfx_boom()[:len(out)] * .6, (0, max(0, len(out) - len(sfx_boom()))))[:len(out)], .85)
def sfx_scratch():                                  # a record scratch: noise swept fast up and down
    d = .6; t = np.arange(int(d * SR)) / SR; cut = 600 + 4000 * np.abs(np.sin(2 * np.pi * 3.2 * t))
    return norm(lowpass(noise(d), cut) * np.exp(-t * 2.5), .8)
def sfx_boing():
    d = .7; t = np.arange(int(d * SR)) / SR; f = 220 + 180 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 4)
    return norm(tone(f, d, 'sine', .005, .5), .5)
def sfx_cricket():
    out = np.zeros(int(1.8 * SR))
    for k in range(5):
        for j in range(3):
            o = int((k * .34 + j * .045) * SR); s = tone(4300, .035, 'sine', .002, .015) * .5; out[o:o + len(s)] += s
    return norm(out, .3)
def sfx_snore():
    d = 1.4; t = np.arange(int(d * SR)) / SR; sh = np.sin(np.pi * t / d) ** 2
    return norm(lowpass(noise(d), 300 + 200 * sh) * sh + tone(90, d, 'saw', .2, 2) * sh * .3, .35)
SFX = {k[4:]: v for k, v in globals().items() if k.startswith('sfx_')}

# ---- music: a cheerful kingdom march, and a tense version for the dragons ----
bpm = ep.get('music', {}).get('bpm', 112); beat = 60 / bpm
sections = [(when(s[0]), s[1]) for s in ep.get('music', {}).get('sections', [[0, 'happy']])]
mood_at = lambda t: [m for (s, m) in sections if s <= t][-1] if any(s <= t for s, _ in sections) else 'happy'
HAPPY = [[60, 64, 67], [67, 71, 74], [69, 72, 76], [65, 69, 72]]          # C G Am F
TENSE = [[57, 60, 64], [58, 62, 65], [57, 60, 64], [56, 59, 64]]          # Am Bb Am E
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
music = np.zeros(N)
def add(sig, at):
    i = int(at * SR)
    if i >= N or i < 0: return
    music[i:i + len(sig)] += sig[:N - i]
nbeats = int(total / beat) + 1
for b in range(nbeats):
    t0 = b * beat; mood = mood_at(t0)
    if mood == 'stop': continue
    bar, pos = divmod(b, 4); prog = TENSE if mood == 'tense' else HAPPY; chord = prog[bar % 4]
    if mood == 'happy':
        for k in range(2):                           # an arpeggio in eighths, plucked
            note = chord[(pos * 2 + k) % 3] + 12; add(tone(midi(note), .3, 'tri', .003, .12) * .22, t0 + k * beat / 2)
        if pos in (0, 2): add(tone(midi(chord[0] - 24), beat * 1.6, 'sine', .005, .35) * .5, t0)
        add(sfx_pop()[:int(.1 * SR)] * .0, t0)
        kick = tone(60 * np.exp(-np.arange(int(.18 * SR)) / SR * 18) + 45, .18, 'sine', .001, .12) * .55
        if pos in (0, 2): add(kick, t0)
        if pos in (1, 3): add(lowpass(noise(.12), 5000) * np.exp(-np.arange(int(.12 * SR)) / SR * 40) * .25, t0)
        add((noise(.04) * np.exp(-np.arange(int(.04 * SR)) / SR * 120)) * .08, t0 + beat / 2)
        if pos == 0 and bar % 2 == 0:                # a bell melody now and then
            for k, step in enumerate([0, 2, 1]): add(tone(midi(chord[step] + 24), .5, 'sine', .002, .25) * .12, t0 + k * beat)
    else:                                            # tense: low pulses and a timpani on the bar
        add(lowpass(tone(midi(chord[0] - 24), beat * .9, 'saw', .01, .3), 700) * .35, t0)
        if pos == 0: add(sfx_boom()[:int(.8 * SR)] * .5, t0)
        add(tone(midi(chord[2] + 12), beat * .5, 'tri', .01, .2) * .1, t0 + beat / 2)
# smooth the cuts between sections
for (s, m) in sections[1:]:
    i = int(s * SR); w = int(.04 * SR); music[max(0, i - w):i] *= np.linspace(1, 0, min(w, i))
music = norm(music, .9)

# ducking: the music dips under the voice, following its loudness
v = np.zeros(N); v[:len(voice)] = voice[:N]
win = int(.05 * SR); loud = np.sqrt(np.convolve(v ** 2, np.ones(win) / win, mode='same'))
talk = np.clip(loud / (np.percentile(loud[loud > 0], 60) + 1e-9), 0, 1) if (loud > 0).any() else np.zeros_like(loud)   # a reel with no voice: no ducking
talk = np.convolve(talk, np.ones(int(.25 * SR)) / int(.25 * SR), mode='same')
music_gain = ep.get('music', {}).get('gain', .32) * (1 - .55 * np.clip(talk, 0, 1))

fx = np.zeros(N)
for s in ep.get('sfx', []):
    sig = SFX[s['name']]() * s.get('gain', 1)
    for k in range(s.get('repeat', 1)):
        at = when(s) + k * s.get('every', .15); i = int(at * SR)
        if 0 <= i < N: fx[i:i + len(sig)] += sig[:N - i] * (1 - .25 * (k % 2))

mix = v * 1.0 + music * music_gain + fx * .55
mix = mix / max(1, np.max(np.abs(mix)) / .97)
out = f'site/episodes/day{day}.mix.mp3'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f64le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'libmp3lame', '-b:a', '192k', out], input=mix.astype(np.float64).tobytes(), check=True)
print(f'{out}: {total:.1f} s, {len(ep.get("sfx", []))} effects, music {[m for _, m in sections]}')
